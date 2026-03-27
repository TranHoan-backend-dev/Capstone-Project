import os
import sys
from dotenv import load_dotenv

# Tải các biến môi trường từ file .env (RABBITMQ_HOST, USER, PASS, v.v.)
load_dotenv()

# Thêm đường dẫn thư mục gốc vào hệ thống path để nhận diện các module nội bộ
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import hàm khởi chạy boundary từ OCR module
from ocr_boundary import start_boundary

def main():
    """
    Điểm vào chính (Entry point) để khởi chạy toàn bộ AI Module.
    Module này sẽ đóng vai trò là một Worker bất đồng bộ trong hệ thống.
    """
    print("--- AI Module đang khởi động ---")
    
    # 1. Khởi chạy logic Boundary của OCR (Lắng nghe các yêu cầu từ hàng đợi)
    # Hàm này sẽ chặn (block) luồng xử lý và liên tục chờ tin nhắn mới từ Backend
    start_boundary()

if __name__ == "__main__":
    # Đảm bảo hàm main được gọi khi chạy file script trực tiếp
    main()
