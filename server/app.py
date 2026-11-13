"""Optional Python static host. The browser calculates salaries locally; no salary data reaches Python."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def do_GET(self):
        # SPA fallback. No API endpoints or salary input handling.
        target = (DIST / self.path.lstrip('/').split('?', 1)[0]).resolve()
        if not target.is_relative_to(DIST) or (not target.exists() and '.' not in self.path):
            self.path = '/index.html'
        super().do_GET()

    def log_message(self, format, *args):
        # Do not log URL path/query: avoid accidental sensitive values in logs.
        pass

if __name__ == '__main__':
    if not (DIST / 'index.html').exists():
        raise SystemExit('Build frontend terlebih dahulu: npm install && npm run build')
    port = int(os.environ.get('PORT', '8000'))
    print(f'Simulasi Kenaikan Gaji tersedia di http://localhost:{port}')
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
