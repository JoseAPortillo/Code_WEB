"""GET / serves the site shell, GET /projects/{name} serves project detail pages."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from fastapi.responses import FileResponse

from app.core.config import AppConfig, get_config

router = APIRouter()


@router.get("/")
async def read_root(config: AppConfig = Depends(get_config)) -> FileResponse:
    return FileResponse(config.index_file)


@router.get("/projects/{project}")
async def read_project(
    project: str, config: AppConfig = Depends(get_config)
) -> FileResponse:
    """Serve a project detail page from src/frontend/projects/{name}.html."""
    if not project or not project.replace("-", "").isalnum():
        raise HTTPException(status_code=404, detail="Project not found")
    page = config.projects_dir / f"{project}.html"
    if not page.is_file():
        raise HTTPException(status_code=404, detail="Project not found")
    return FileResponse(page)
