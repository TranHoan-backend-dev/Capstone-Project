import pika
import os

def create_connection():
    """
    Hàm này tạo kết nối chính tới máy chủ RabbitMQ.
    Sử dụng các biến môi trường cấu hình tại file .env (User, Pass, Host, Port).
    """
    # Thiết lập thông tin xác thực từ môi trường (RabbitMQ)
    credentials = pika.PlainCredentials(
        os.getenv("RABBITMQ_USER", "guest"), # Mặc định là guest nếu không tìm thấy cấu hình
        os.getenv("RABBITMQ_PASS", "guest")
    )

    # Cấu hình các tham số kết nối (Host và Port)
    parameters = pika.ConnectionParameters(
        host=os.getenv("RABBITMQ_HOST", "localhost"), # Hostname của máy chủ RabbitMQ
        port=int(os.getenv("RABBITMQ_PORT", 5672)),    # Cổng mặc định AMQP (5672)
        credentials=credentials
    )

    # Trả về kết nối BlockingConnection của thư viện pika
    return pika.BlockingConnection(parameters)


def create_channel():
    """
    Hàm này khởi tạo một kênh truyền tải (Channel) từ một kết nối RabbitMQ mới.
    Các thao tác gửi/nhận tin nhắn đều phải thông qua Channel.
    """
    # Khởi tạo một kết nối mới
    connection = create_connection()
    # Mở và trả về channel từ kết nối đó
    return connection.channel()