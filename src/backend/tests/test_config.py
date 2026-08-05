"""Unit tests: AppConfig path resolution and factory config injection."""
from pathlib import Path

from fastapi.testclient import TestClient

from app.core.config import AppConfig
from app.main import create_app

REPO_ROOT = Path(__file__).resolve().parents[3]  # src/backend/tests -> repo root


def test_default_config_resolves_repo_paths():
    cfg = AppConfig()
    assert cfg.project_root == REPO_ROOT
    assert cfg.static_dir == REPO_ROOT / "src/frontend"
    assert cfg.index_file == REPO_ROOT / "src/frontend/index.html"


def test_create_app_returns_runnable_app():
    app = create_app()
    with TestClient(app) as c:
        assert c.get("/health").status_code == 200
        assert c.get("/").status_code == 200


def test_injected_config_serves_temp_dir(tmp_path):
    # Build a minimal fake site tree in a temp dir and point the config at it.
    static = tmp_path / "src" / "frontend"
    static.mkdir(parents=True)
    (static / "index.html").write_text("<html>INJECTED-CONFIG</html>", encoding="utf-8")
    (static / "probe.txt").write_text("probe", encoding="utf-8")

    cfg = AppConfig(project_root=tmp_path)
    app = create_app(config=cfg)
    with TestClient(app) as c:
        assert cfg.project_root == tmp_path
        assert cfg.static_dir == static
        assert cfg.index_file == static / "index.html"
        # FileResponse resolves against the injected config.
        resp = c.get("/")
        assert resp.status_code == 200
        assert "INJECTED-CONFIG" in resp.text
        # Static mount resolves against the injected config.
        assert c.get("/static/probe.txt").status_code == 200
        assert c.get("/static/probe.txt").text == "probe"
