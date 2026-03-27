import json
import random
from consumer.subcriber import consume
from producer.publisher import publish

def mock_ocr_processing(image_url, customer_id):
    """
    Giả lập quá trình xử lý AI cho OCR (Đồng hồ nước).
    Trả về dữ liệu mock cho số serial và chỉ số đồng hồ.
    """
    print(f"[*] Đang xử lý ảnh: {image_url} cho Khách hàng: {customer_id}")
    
    # Tạo dữ liệu giả lập (Mock data generation)
    mock_serial = f"WM-{random.randint(100000, 999999)}" # Số serial giả
    mock_reading = random.randint(100, 5000)            # Chỉ số nước giả (m3)
    
    result = {
        "image_url": image_url,
        "customer_id": customer_id,
        "serial_number": mock_serial,
        "reading": mock_reading,
        "status": "SUCCESS"
    }
    
    return result

def handle_ocr_request(data):
    """
    Hàm callback xử lý các yêu cầu OCR đến từ Backend.
    """
    try:
        # 1. Phân tích tin nhắn đến (Parsing request)
        image_url = data.get("image_url")
        customer_id = data.get("customer_id")
        
        # Kiểm tra tính hợp lệ của dữ liệu đầu vào
        if not image_url or not customer_id:
            print("[!] Thiếu dữ liệu bắt buộc trong message (image_url/customer_id).")
            return

        # 2. Xử lý (Mock AI processing)
        # Trong thực tế, đây là nơi gọi Model AI để trích xuất thông tin từ ảnh
        result = mock_ocr_processing(image_url, customer_id)
        
        # 3. Gửi kết quả ngược lại cho Backend qua hàng đợi 'water_meter.response'
        publish(
            exchange='', # Sử dụng Default direct exchange
            routing_key='water_meter.response',
            message=result
        )
        print(f"[x] Đã xử lý thành công và gửi kết quả cho khách hàng {customer_id}")

    except Exception as e:
        print(f"[!] Lỗi khi xử lý yêu cầu OCR: {e}")

def start_boundary():
    """
    Khởi động Boundary để lắng nghe các tin nhắn từ hàng đợi 'water_meter.request'.
    """
    print("[*] AI Module Boundary đã sẵn sàng. Đang lắng nghe các yêu cầu OCR...")
    
    # Đăng ký lắng nghe trên queue 'water_meter.request'
    # Module AI đóng vai trò là một Worker tiêu thụ (Consumer) các task từ Backend
    consume(
        queue='water_meter.request',
        callback_func=handle_ocr_request
    )

if __name__ == "__main__":
    # Lưu ý: Đảm bảo các biến môi trường (RABBITMQ_HOST, etc.) đã được thiết lập trong file .env
    start_boundary()
