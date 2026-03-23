import sys
import os

# Add parent directory to sys.path to resolve core module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
from core.connection import create_channel

def publish(exchange, routing_key, message: dict):
    channel = create_channel()

    channel.basic_publish(
        exchange=exchange,
        routing_key=routing_key,
        body=json.dumps(message),
        properties=None
    )

    print(f"[x] Sent {message}")