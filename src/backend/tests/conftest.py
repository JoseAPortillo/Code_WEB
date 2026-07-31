"""Shared test fixtures.

The client fixture builds a TestClient over the app under test. Imports are
adjusted per refactor slice: Phase 1 targets the baseline ``main`` module;
later phases target the ``app`` package factory.
"""
import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture()
def client():
    with TestClient(app) as c:
        yield c
