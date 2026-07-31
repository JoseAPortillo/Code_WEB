"""Application configuration.

A plain frozen dataclass (no pydantic-settings: no env vars needed, YAGNI).
The project root is resolved from this file's location, mirroring the baseline
main.py behavior (parent of ``src/``), so the app runs from anywhere.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parents[4]  # src/backend/app/core/config.py -> repo root


@dataclass(frozen=True)
class AppConfig:
    """Resolved paths for the site. Tests can inject a temp-dir project_root."""

    project_root: Path = field(default_factory=lambda: _PROJECT_ROOT)

    @property
    def assets_dir(self) -> Path:
        return self.project_root / "assets"

    @property
    def static_dir(self) -> Path:
        return self.project_root / "src/frontend"

    @property
    def index_file(self) -> Path:
        return self.static_dir / "index.html"


def get_config() -> AppConfig:
    """FastAPI dependency provider; create_app() overrides it with the app config."""
    return AppConfig()
