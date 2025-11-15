import unittest
from main import some_function  # import hàm bạn muốn test từ main.py

class SampleTest(unittest.TestCase):
    def test_example(self):
        self.assertEqual(1 + 1, 2)
        # ví dụ test thêm hàm trong main.py
        # self.assertEqual(some_function(), expected_value)

if __name__ == "__main__":
    unittest.main()
