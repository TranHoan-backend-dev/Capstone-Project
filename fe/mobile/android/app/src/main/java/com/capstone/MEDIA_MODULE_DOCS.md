# Media Module Documentation

## 1. Overview

Module Media chịu trách nhiệm cho các tính năng liên quan đến hình ảnh:

- Chụp ảnh và upload lên Google Cloud Storage (GCS).
- Lưu trữ URL ảnh đã upload vào hệ thống Backend.
- Cung cấp Placeholder cho chức năng OCR (nhận diện văn bản) trong tương lai.

## 2. Technical Architecture

Module tuân thủ kiến trúc Clean Architecture hiện tại của dự án:

### Domain Layer (`com.capstone.domain.repository`)

- **`MediaRepository`**: Interface định nghĩa các hành vi: `processCapturedImage` (xử lý ảnh sau chụp) và `performOcr` (nhận diện văn bản).

### Data Layer (`com.capstone.data`)

- **`MediaRepositoryImpl`**: Thực thi logic nghiệp vụ (Upload GCS trước, sau đó lưu URL về BE).
- **`source/remote/MediaApi`**: Định nghĩa endpoint Retrofit để giao tiếp với Backend.
- **`source/remote/GoogleCloudUploader`**: Service hạ tầng xử lý việc đẩy file lên GCS.
- **`source/request/SaveImageUrlRequest`**: DTO gửi dữ liệu về Backend.

### Bridge Layer (`com.capstone.bridge`)

- **`MediaBridgeModule`**: Exposed cho React Native với tên `MediaModule`.
- **`MediaBridgePackage`**: Đăng ký module với hệ thống React Native.

### DI Layer (`com.capstone.di`)

- **`MediaModule`**: Cấu hình Hilt để inject các dependencies.

## 3. Interaction Flow

1. **React Native**: Chụp ảnh và lấy đường dẫn cục bộ (local path).
2. **Bridge**: Gọi `MediaModule.uploadCapturedImage(localPath)`.
3. **Repository**:
   - Gọi `GoogleCloudUploader` để đẩy ảnh lên Cloud.
   - Nhận lại GCS URL.
   - Gọi `MediaApi` để lưu URL này vào Backend.
4. **Result**: Trả về URL cuối cùng cho phía Javascript.

## 4. Usage in Javascript

```javascript
import { NativeModules } from 'react-native';
const { MediaModule } = NativeModules;

// Upload ảnh
const url = await MediaModule.uploadCapturedImage(filePath);

// OCR Placeholder
const result = await MediaModule.performOcr(url);
```
