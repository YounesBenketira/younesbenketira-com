"""Convert an Overpass export into the portfolio's local coordinate system."""
import json
import math
import re
import sys
from pathlib import Path

HALL = (36.7346126, 3.14186175)
MINARET = (36.7358016, 3.137990225)
METERS_LAT = 111320
METERS_LON = METERS_LAT * math.cos(math.radians(HALL[0]))
EAST = (MINARET[1] - HALL[1]) * METERS_LON
NORTH = (MINARET[0] - HALL[0]) * METERS_LAT
DENOM = EAST * EAST + NORTH * NORTH
A = (-48 * EAST - 241 * NORTH) / DENOM
B = (-48 * NORTH + 241 * EAST) / DENOM
SCALE = math.hypot(A, B)


def project(point):
    east = (point['lon'] - HALL[1]) * METERS_LON
    north = (point['lat'] - HALL[0]) * METERS_LAT
    return [round(A * east + B * north, 2), round(B * east - A * north - 78, 2)]


def ring(geometry):
    points = [project(point) for point in geometry]
    if points and points[0] == points[-1]:
        points.pop()
    return points


def center(points):
    return [sum(p[i] for p in points) / len(points) for i in range(2)]


def number(value, default):
    match = re.search(r'\d+(?:\.\d+)?', str(value))
    return float(match[0]) if match else default


def building(element, geometry, holes=None):
    points = ring(geometry)
    if len(points) < 3:
        return None
    x, z = center(points)
    if -110 < x < 110 and -155 < z < 250:
        return None
    tags = element.get('tags', {})
    kind = tags.get('building', 'yes')
    levels = {'house': 2, 'garage': 1, 'garages': 1, 'roof': 1, 'apartments': 6,
              'hotel': 10, 'office': 6, 'industrial': 2, 'warehouse': 2,
              'retail': 2, 'supermarket': 2, 'college': 4, 'school': 3}.get(kind, 4)
    levels = number(tags.get('building:levels'), levels)
    height = number(tags.get('height'), levels * 3.2)
    measured = 'height' in tags or 'building:levels' in tags
    local_name = tags.get('name', '')
    french_name = tags.get('name:fr', local_name)
    label = tags.get('name:en', french_name)
    bounded_height = min(200, max(2, height))
    scene_height = round(bounded_height * SCALE, 2)
    return {'id': element['id'], 'p': points, 'holes': holes or [],
            'h': scene_height, 'known': measured,
            'kind': kind, 'name': label}


def road(element):
    tags = element['tags']
    kind = tags.get('highway', 'residential')
    widths = {'motorway': 10, 'motorway_link': 6, 'trunk': 9, 'trunk_link': 6,
              'primary': 9, 'secondary': 8, 'tertiary': 7, 'residential': 6,
              'service': 4, 'footway': 2.5, 'path': 1.8, 'steps': 2, 'pedestrian': 5}
    default_width = widths.get(kind, 5)
    width = number(tags.get('width'), default_width)
    return {'id': element['id'], 'p': [project(p) for p in element['geometry']],
            'w': round(width * SCALE, 2), 'kind': kind,
            'bridge': tags.get('bridge', 'no') != 'no', 'name': tags.get('name', tags.get('ref', ''))}


def inside(point, polygon):
    x, z = point
    result = False
    previous = polygon[-1]
    for current in polygon:
        crossing = (current[1] > z) != (previous[1] > z)
        if crossing:
            edge_x = (previous[0] - current[0]) * (z - current[1]) / (previous[1] - current[1]) + current[0]
            if x < edge_x:
                result = not result
        previous = current
    return result


def relation_buildings(element):
    members = element.get('members', [])
    outers = [m['geometry'] for m in members if m.get('role') == 'outer' and m.get('geometry')]
    holes = [ring(m['geometry']) for m in members if m.get('role') == 'inner' and m.get('geometry')]
    results = []
    for geometry in outers:
        polygon = ring(geometry)
        contained = [h for h in holes if h and inside(h[0], polygon)]
        result = building(element, geometry, contained)
        if result:
            results.append(result)
    return results


def terrain_grid(raw):
    size = 129
    extent = 5600
    source_size = raw['size']
    south, west, north, east = raw['box']
    def elevation(lat, lon):
        col = max(0, min(source_size - 1, (lon - west) / (east - west) * (source_size - 1)))
        row = max(0, min(source_size - 1, (lat - south) / (north - south) * (source_size - 1)))
        x0, y0 = int(col), int(row)
        x1, y1 = min(source_size - 1, x0 + 1), min(source_size - 1, y0 + 1)
        fraction_x, fraction_y = col - x0, row - y0
        upper = raw['heights'][y0 * source_size + x0] * (1 - fraction_x) + raw['heights'][y0 * source_size + x1] * fraction_x
        lower = raw['heights'][y1 * source_size + x0] * (1 - fraction_x) + raw['heights'][y1 * source_size + x1] * fraction_x
        return upper * (1 - fraction_y) + lower * fraction_y
    origin_height = elevation(*HALL)
    heights = []
    for row in range(size):
        z = -extent + row * extent * 2 / (size - 1)
        for col in range(size):
            x = -extent + col * extent * 2 / (size - 1)
            local_z = z + 78
            e = (A * x + B * local_z) / (SCALE * SCALE)
            n = (B * x - A * local_z) / (SCALE * SCALE)
            value = elevation(HALL[0] + n / METERS_LAT, HALL[1] + e / METERS_LON)
            outside_x = max(-115 - x, 0, x - 260)
            outside_z = max(-175 - z, 0, z - 280)
            distance = math.hypot(outside_x, outside_z)
            weight = min(1, distance / 180)
            weight = weight * weight * (3 - 2 * weight)
            heights.append(round((value - origin_height) * SCALE * weight - .8, 2))
    return {'size': size, 'extent': extent, 'h': heights, 'sea': round(-origin_height * SCALE + .2, 2),
            'source': raw['source'], 'sourceTiles': raw['tiles'], 'sourceZoom': raw['zoom']}


def coastline(elements):
    segments = [e['geometry'] for e in elements if e.get('tags', {}).get('natural') == 'coastline']
    segments = [g for g in segments if g[0] != g[-1]]
    chain = segments.pop(0)
    while segments:
        connected = False
        for segment in segments:
            if segment[0] == chain[-1]:
                chain.extend(segment[1:])
            elif segment[-1] == chain[0]:
                chain = segment[:-1] + chain
            else:
                continue
            segments.remove(segment)
            connected = True
            break
        if not connected:
            raise ValueError('Coastline export is disconnected')
    north = max(p['lat'] for p in chain) + .06
    water = chain + [{'lat': north, 'lon': chain[-1]['lon']}, {'lat': north, 'lon': chain[0]['lon']}]
    return {'p': ring(water), 'shore': [project(p) for p in chain]}


def collect_ways(features):
    buildings, roads, surfaces, rivers = [], [], [], []
    for element in features.values():
        tags = element.get('tags', {})
        geometry = element.get('geometry', [])
        if len(geometry) < 2:
            continue
        if 'building' in tags:
            result = building(element, geometry)
            if result:
                buildings.append(result)
        if 'highway' in tags and tags.get('tunnel', 'no') == 'no':
            roads.append(road(element))
        if tags.get('waterway') in ('river', 'canal', 'stream'):
            rivers.append({'p': [project(p) for p in geometry], 'w': number(tags.get('width'), 25) * SCALE})
        landuse = 'landuse' in tags
        park = tags.get('leisure') == 'park'
        water = tags.get('natural') == 'water'
        if landuse or park or water:
            kind = tags.get('landuse', tags.get('natural', 'park'))
            surfaces.append({'id': element['id'], 'p': ring(geometry), 'kind': kind})
    return buildings, roads, surfaces, rivers


def main():
    source = Path(sys.argv[1])
    target = Path(sys.argv[2])
    primary = json.loads((source / 'algiers-osm.json').read_text(encoding='utf-8'))
    extra = json.loads((source / 'algiers-osm-extra.json').read_text(encoding='utf-8'))
    relations = json.loads((source / 'algiers-osm-relations.json').read_text(encoding='utf-8'))
    elevation = json.loads((source / 'algiers-terrain.json').read_text(encoding='utf-8'))
    features = {e['id']: e for e in primary['elements'] + extra['elements'] if e['type'] == 'way'}
    buildings, roads, surfaces, rivers = collect_ways(features)
    for element in relations['elements']:
        if 'building' in element.get('tags', {}) and element['id'] != 17805398:
            buildings.extend(relation_buildings(element))
    site = features[226928471]
    result = {'meta': {'osmTimestamp': primary['osm3s']['timestamp_osm_base'], 'license': 'ODbL-1.0',
              'source': 'https://www.openstreetmap.org/copyright', 'bbox': [36.700, 3.095, 36.775, 3.185],
              'hallAnchor': HALL, 'minaretAnchor': MINARET, 'scale': SCALE, 'a': A, 'b': B,
              'heightPolicy': 'OSM height/levels where present; estimated type-based heights otherwise'},
              'buildings': buildings, 'roads': roads, 'surfaces': surfaces, 'rivers': rivers,
              'sea': coastline(primary['elements']), 'site': ring(site['geometry']), 'terrain': terrain_grid(elevation)}
    target.write_text(json.dumps(result, ensure_ascii=True, separators=(',', ':')), encoding='utf-8')
    print({'buildings': len(buildings), 'knownHeights': sum(b['known'] for b in buildings),
           'roads': len(roads), 'scale': SCALE, 'bytes': target.stat().st_size})


if __name__ == '__main__':
    main()
