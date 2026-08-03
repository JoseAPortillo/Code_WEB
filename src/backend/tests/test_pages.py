"""Characterization tests: GET / serves the index.html shell with key markers."""


def test_root_serves_index_html(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert "text/html" in resp.headers["content-type"]
    html = resp.text
    assert "<title>JAP" in html
    assert 'class="project-row"' in html
    assert 'class="brand"' in html


def test_root_keeps_markup_markers(client):
    html = client.get("/").text
    # Document-level markers that must survive the refactor.
    assert '<html lang="en">' in html
    assert 'class="topbar-nav"' in html
    assert 'id="proyectos"' in html


def test_project_card_links_to_standalone_page(client):
    html = client.get("/").text
    # Project cards point to a dedicated standalone page, not an inline section.
    assert 'href="/projects/aimation"' in html
    assert 'id="aimation"' not in html


def test_project_page_serves_aimation(client):
    resp = client.get("/projects/aimation")
    assert resp.status_code == 200
    assert "text/html" in resp.headers["content-type"]
    html = resp.text
    assert "<title>AImation" in html
    assert "specsecops" in html.lower()
    assert 'class="project-hero"' in html


def test_project_page_serves_cuqui(client):
    resp = client.get("/projects/cuqui")
    assert resp.status_code == 200
    html = resp.text
    assert "<title>Cuqui" in html
    assert "cuqui-app.duckdns.org" in html
    assert "voice" in html.lower()


def test_project_page_serves_multicams_watcher(client):
    resp = client.get("/projects/multicams-watcher")
    assert resp.status_code == 200
    html = resp.text
    assert "<title>Multicams-Watcher" in html
    assert "tailscale" in html.lower()
    assert "PTZ" in html
    assert "detection" in html.lower()
    assert "opencv" in html.lower()
    assert "mediapipe" in html.lower()


def test_project_page_404_unknown(client):
    assert client.get("/projects/nope").status_code == 404
    assert client.get("/projects/../../secret").status_code == 404
