from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="JAP Website")

# Get the project root (parent of src/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Mount static files
app.mount("/assets", StaticFiles(directory=os.path.join(PROJECT_ROOT, "assets")), name="assets")
app.mount("/static", StaticFiles(directory=os.path.join(PROJECT_ROOT, "src/frontend")), name="static")

@app.get("/")
async def read_root():
    return FileResponse(os.path.join(PROJECT_ROOT, "src/frontend/index.html"))

@app.get("/health")
async def health_check():
    return {"status": "ok"}
