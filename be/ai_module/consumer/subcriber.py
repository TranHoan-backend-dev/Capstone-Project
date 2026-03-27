import sys
import os
import json

# Thêm thư mục cha vào sys.path để trình thông dịch Python có thể tìm thấy module 'core'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.connection import create_channel

def consume(queue, callback_func):
    """
    Hàm này chịu trách nhiệm lắng nghe (consume) các tin nhắn từ một hàng đợi (queue) cụ thể trên RabbitMQ.
    Nó sử dụng một hàm callback_func để xử lý từng tin nhắn nhận được.
    """
    # Khởi tạo channel từ core connection đã thiết lập
    channel = create_channel()

    def callback(ch, method, properties, body):
        """
        Giao diện callback nội bộ để phân giải (parse) dữ liệu JSON và chuyển cho domain logic.
        """
        # Giải mã dữ liệu JSON nhận được từ hàng đợi
        data = json.loads(body)
        
        # Gọi hàm xử lý logic nghiệp vụ truyền vào từ ngoài
        callback_func(data)

    # Đảm bảo hàng đợi tồn tại trên RabbitMQ trước khi bắt đầu lắng nghe
    # durable=False: Hàng đợi sẽ mất nếu RabbitMQ restart (phù hợp cho dev/mock)
    channel.queue_declare(queue=queue, durable=False)

    # Đăng ký nhận tin nhắn từ hàng đợi được chỉ định
    # auto_ack=True: RabbitMQ tự động xác nhận tin nhắn đã được xử lý (ack) ngay khi gửi đi
    channel.basic_consume(
        queue=queue,
        on_message_callback=callback,
        auto_ack=True
    )

    print(f"[*] Đang chờ tin nhắn trong hàng đợi: {queue}")
    # Bắt đầu vòng lặp vô tận lắng nghe các message mới
    channel.start_consuming()