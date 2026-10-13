"""Validate geographic alignment and the bundled surrounding-city dataset."""
import importlib.util
import json
import math
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('context_importer', ROOT / 'scripts/import-context.py')
IMPORTER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(IMPORTER)


class ContextDataTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads((ROOT / 'dist/data/algiers-context.json').read_text(encoding='utf-8'))

    def test_architecture_anchors(self):
        hall = IMPORTER.project({'lat': IMPORTER.HALL[0], 'lon': IMPORTER.HALL[1]})
        minaret = IMPORTER.project({'lat': IMPORTER.MINARET[0], 'lon': IMPORTER.MINARET[1]})
        self.assertEqual(hall, [0, -78])
        self.assertEqual(minaret, [-48, 163])

    def test_height_tags_override_estimates(self):
        geometry = [{'lat': 36.72, 'lon': 3.14}, {'lat': 36.72, 'lon': 3.1401},
                    {'lat': 36.7201, 'lon': 3.1401}, {'lat': 36.72, 'lon': 3.14}]
        measured = IMPORTER.building({'id': 1, 'tags': {'height': '18 m', 'building:levels': '3'}}, geometry)
        estimated = IMPORTER.building({'id': 2, 'tags': {'building': 'garage'}}, geometry)
        self.assertTrue(measured['known'])
        self.assertAlmostEqual(measured['h'], 18 * IMPORTER.SCALE, places=2)
        self.assertFalse(estimated['known'])
        self.assertLess(estimated['h'], measured['h'])

    def test_custom_mosque_is_not_duplicated(self):
        for building in self.data['buildings']:
            x, z = IMPORTER.center(building['p'])
            core = -110 < x < 110 and -155 < z < 250
            self.assertFalse(core, building['id'])

    def test_geometry_and_elevation_are_finite(self):
        for building in self.data['buildings']:
            self.assertGreaterEqual(len(building['p']), 3)
            self.assertGreater(building['h'], 0)
            for point in building['p']:
                finite = all(math.isfinite(value) for value in point)
                self.assertTrue(finite)
            for hole in building['holes']:
                self.assertTrue(IMPORTER.inside(hole[0], building['p']))
        terrain = self.data['terrain']
        self.assertEqual(len(terrain['h']), terrain['size'] ** 2)
        finite = all(math.isfinite(value) for value in terrain['h'])
        self.assertTrue(finite)
        self.assertLess(terrain['sea'], 0)

    def test_export_retains_provenance(self):
        self.assertEqual(self.data['meta']['license'], 'ODbL-1.0')
        self.assertTrue(self.data['meta']['osmTimestamp'].endswith('Z'))
        self.assertGreater(len(self.data['buildings']), 24000)
        self.assertGreater(len(self.data['roads']), 7000)
        known = sum(building['known'] for building in self.data['buildings'])
        self.assertGreater(known, 800)
        self.assertLess(known, len(self.data['buildings']))
        self.assertGreater(len(self.data['sea']['shore']), 1000)


if __name__ == '__main__':
    unittest.main()
