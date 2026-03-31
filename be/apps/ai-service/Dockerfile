FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV TORCH_HOME=/opt/torch
ENV YOLO_REPO_PATH=/opt/yolov5

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    libgl1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

RUN git clone --depth 1 https://github.com/ultralytics/yolov5 /opt/yolov5 && \
    pip install --extra-index-url https://download.pytorch.org/whl/cpu -r /opt/yolov5/requirements.txt

COPY app app
COPY app_utils app_utils
COPY config config
COPY detector detector
COPY models models
COPY ocr ocr

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "app.api:app", "--host", "0.0.0.0", "--port", "8000"]
