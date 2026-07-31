"""Shared test fixtures.

The client fixture builds a TestClient over the app factory with default
config; config-override tests build their own apps with a temp-dir config.
"""
import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture()
def client():
    with TestClient(create_app()) as c:
        yield c
