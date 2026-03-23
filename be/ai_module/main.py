import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from consumer.subcriber import consume
from producer.publisher import publish

def main():
    print("AI Module started.")
    # Add your logic here or start a consumer
    # example: consume('my_queue', lambda data: print(data))
    pass

if __name__ == "__main__":
    main()
