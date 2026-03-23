import sys
import os

# Add parent directory to sys.path to resolve core module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import json
from core.connection import create_channel

def consume(queue, callback_func):
    channel = create_channel()

    def callback(ch, method, properties, body):
        data = json.loads(body)
        callback_func(data)

    channel.basic_consume(
        queue=queue,
        on_message_callback=callback,
        auto_ack=True
    )

    print(f"[*] Waiting for messages in {queue}")
    channel.start_consuming()