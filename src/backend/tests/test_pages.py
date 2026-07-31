"""Characterization tests: GET / serves the index.html shell with key markers."""


def test_root_serves_index_html(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert "text/html" in resp.headers["content-type"]
    html = resp.text
    assert "<title>JAP" in html
    assert 'id="resourceGrid"' in html
    assert 'class="brand"' in html


def test_root_keeps_markup_markers(client):
    html = client.get("/").text
    # Document-level markers that must survive the refactor.
    assert '<html lang="es" data-theme="dark">' in html
    assert 'id="themeToggle"' in html
    assert 'id="searchInput"' in html
