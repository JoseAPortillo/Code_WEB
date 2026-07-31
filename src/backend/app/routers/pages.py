"""GET / serves the site shell."""
from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse

from app.core.config import AppConfig, get_config

router = APIRouter()


@router.get("/")
async def read_root(config: AppConfig = Depends(get_config)) -> FileResponse:
    return FileResponse(config.index_file)
