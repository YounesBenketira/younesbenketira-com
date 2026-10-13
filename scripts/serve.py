import argparse
import re
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.range_remaining = None
        path = Path(self.translate_path(self.path))
        requested = self.headers.get("Range")
        is_video = path.suffix.lower() == ".mp4"
        is_file = path.is_file()
        if not requested or not is_video or not is_file:
            return super().send_head()
        stream = path.open("rb")
        size = path.stat().st_size
        bounds = byte_range(requested, size)
        if bounds is None:
            stream.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None
        start, end = bounds
        self.range_remaining = end - start + 1
        stream.seek(start)
        self.send_response(206)
        self.send_header("Content-Type", "video/mp4")
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(self.range_remaining))
        self.end_headers()
        return stream

    def copyfile(self, source, outputfile):
        if self.range_remaining is None:
            return super().copyfile(source, outputfile)
        while self.range_remaining > 0:
            chunk = source.read(min(65536, self.range_remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            self.range_remaining -= len(chunk)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()


def byte_range(value, size):
    match = re.fullmatch(r"bytes=(\d*)-(\d*)", value)
    if not match or size == 0:
        return None
    first, last = match.groups()
    if not first:
        count = int(last or 0)
        return (max(0, size - count), size - 1) if count > 0 else None
    start = int(first)
    end = min(int(last), size - 1) if last else size - 1
    return (start, end) if start <= end else None


def main():
    parser = argparse.ArgumentParser(description="Serve the current site without browser caching.")
    parser.add_argument("--port", type=int, default=8767)
    args = parser.parse_args()
    directory = Path(__file__).resolve().parent.parent / "dist"
    handler = partial(PreviewHandler, directory=str(directory))
    with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
        server.serve_forever()


if __name__ == "__main__":
    main()
