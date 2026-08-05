"""Application factory.

``create_app`` builds the FastAPI app: mounts /assets and /static against the
resolved config, registers the routers, and wires the config dependency.
The module-level ``app = create_app()`` keeps ``uvicorn app.main:app --reload``
working from ``src/backend``.
"""
from __future__ import annotations

import mimetypes
from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.config import AppConfig, get_config
from app.routers import health, pages

# Windows ships no registry mapping for .js, so Python's mimetypes resolves
# it as text/plain and browsers refuse to run module scripts served that way
# (strict MIME checking). Register the type before mounting static files.
mimetypes.add_type("text/javascript", ".js")


def create_app(config: AppConfig | None = None) -> FastAPI:
    cfg = config or AppConfig()

    app = FastAPI(title="JAP Website")
    app.dependency_overrides[get_config] = lambda: cfg

    app.mount("/assets", StaticFiles(directory=cfg.assets_dir), name="assets")
    app.mount("/static", StaticFiles(directory=cfg.static_dir), name="static")
    app.include_router(pages.router)
    app.include_router(health.router)

    return app


app = create_app()
