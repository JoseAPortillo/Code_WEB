"""Characterization tests: static mounts resolve real files."""


def test_static_fonts_served(client):
    resp = client.get("/static/fonts/vt323-latin.woff2")
    assert resp.status_code == 200
    resp = client.get("/static/fonts/vt323-latinext.woff2")
    assert resp.status_code == 200


def test_assets_served(client):
    resp = client.get("/assets/fondo.png")
    assert resp.status_code == 200


def test_js_served_as_javascript(client):
    """Module scripts must be served as text/javascript, not text/plain.

    On Windows, Python's mimetypes resolves .js to text/plain (no registry
    mapping) and browsers refuse to run module scripts served that way.
    """
    resp = client.get("/static/js/main.js")
    assert resp.status_code == 200
    assert resp.headers["content-type"].startswith("text/javascript")

