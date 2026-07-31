"""Characterization tests: static mounts resolve real files."""


def test_static_fonts_served(client):
    resp = client.get("/static/fonts/geist-mono.woff2")
    assert resp.status_code == 200


def test_assets_served(client):
    resp = client.get("/assets/fondo.png")
    assert resp.status_code == 200
