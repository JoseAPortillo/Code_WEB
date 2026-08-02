"""Characterization tests: GET / serves the index.html shell with key markers."""


def test_root_serves_index_html(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert "text/html" in resp.headers["content-type"]
    html = resp.text
    assert "<title>JAP" in html
    assert 'class="resource-card"' in html
    assert 'class="brand"' in html


def test_root_keeps_markup_markers(client):
    html = client.get("/").text
    # Document-level markers that must survive the refactor.
    assert '<html lang="es">' in html
    assert 'class="topbar-nav"' in html
    assert 'id="proyectos"' in html
