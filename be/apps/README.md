# **Cách Tạo Multi-Module Gradle**

## Chạy lệnh sau để tạo service con:

Đối với spring boot

```bash
nx generate @nxrocks/nx-spring-boot:project user-service
```

---

## Khi tạo project mới thì kiểm tra 2 file sau:
services/settings.gradle
&lt;tên service vừa tạo&gt;/project.json

Kiểm tra 2 trường sau, chúng phải trùng khớp tên với nhau thì mới build được:

services/settings.gradle:

```bash
include 'tên service'
```

&lt;tên service vừa tạo&gt;/project.json

```json
{
  "name": "tên service"
}
```

Thêm đoạn code sau vào project.json của service:

```json
"targets": {
    "run": {
      "executor": "@nxrocks/nx-spring-boot:run"
    },
    "build": {
      "executor": "@nxrocks/nx-spring-boot:build"
    }
  }
```

---

### **Cách build và chạy dự án**

#### Dùng lệnh sau để build:

```bash
nx build tên_service
```

hoặc đối với spring boot:

```bash
nx run tên_service:build
```

#### Chạy dự án:

```bash
nx run tên_service:run
```

hoặc

```bash
// phải cd về thư mục chứa gradlew trước
.\gradlew tên_service:bootRun
```

---

### **Cách thêm plugin mới cho nx**

Dùng lệnh sau:

```bash
nx add @tên_plugin
```

Tên plugin là gì thì có thể lên trang sau để tra cứu <https://nx.dev/docs/plugin-registry#_top>
