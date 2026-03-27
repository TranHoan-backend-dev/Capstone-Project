import sys
import os
import json

# Thêm thư mục cha vào sys.path để trình thông dịch Python có thể tìm thấy module 'core'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.connection import create_channel

def publish(exchange, routing_key, message: dict):
    """
    Hàm này được sử dụng để gửi (publish) một tin nhắn vào RabbitMQ.
    Gửi kết quả từ module AI về Backend thông qua exchange hoặc routing key cụ thể.
    """
    # Khởi tạo channel từ core connection
    channel = create_channel()
    
    # Nếu đang gửi vào một hàng đợi trực tiếp (exchange mặc định)
    if exchange == '':
        # Đảm bảo hàng đợi (kết quả) tồn tại để đảm bảo tin nhắn không bị mất
        channel.queue_declare(queue=routing_key, durable=False)

    # Đẩy tin nhắn dưới dạng JSON string vào hàng đợi
    channel.basic_publish(
        exchange=exchange,
        routing_key=routing_key,
        body=json.dumps(message),
        properties=None
    )

    # Log thông tin để kiểm soát việc gửi thành công
    print(f"[x] Đã gửi message: {message}")