FROM python:3.12-slim

WORKDIR /app

# App needs the whole repo root: config.py resolves project_root as parents[4]
COPY src ./src
COPY requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

WORKDIR /app/src/backend

EXPOSE 8001

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
