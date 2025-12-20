```bash
# Tạo namespace trước
kubectl apply -f be/apps/k8s/namespace.yaml

# Triển khai hạ tầng
kubectl apply -f be/apps/k8s/postgres/
kubectl apply -f be/apps/k8s/mongodb/
kubectl apply -f be/apps/k8s/rabbitmq/

# Triển khai các dịch vụ
kubectl apply -f be/apps/k8s/services/

# Triển khai Kong Gateway
kubectl apply -f be/apps/k8s/kong/
```
