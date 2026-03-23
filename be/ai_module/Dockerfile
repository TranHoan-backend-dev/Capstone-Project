FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Since there is no main.py, I'll add a dummy entry point or leave it configurable
# CMD ["python", "your_main_script.py"]
