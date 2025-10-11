## Cách build va chạy dự án

1. Build

Ví dụ muốn build be/services/sample-java

Trong đó // là vị trí thư mục gốc nơi đặt MOUDLE.bazel, sau // là folder chứa target mà cùng cấp với MODULE.bazel. 

```bash
bazel build //be//services/sample-java:all
```

2. Run

```bash
bazel run //be/services/sample-python:main
```