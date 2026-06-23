"""
Application configuration.
"""
import os

# Server
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# API
API_PREFIX = "/api"
MAX_MESSAGE_LENGTH = 500
