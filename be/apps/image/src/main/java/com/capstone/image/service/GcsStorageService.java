package com.capstone.image.service;

import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GcsStorageService {
  final Storage storage;
  @Value("${gcs.bucket}")
  String bucketName;
  final static String PREFIX = "https://storage.googleapis.com/";

  public String upload(@NonNull MultipartFile file, String folder) {
    try {
      var fileName = folder + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

      var blobInfo = BlobInfo.newBuilder(bucketName, fileName)
        .setContentType(file.getContentType())
        .build();

      storage.create(blobInfo, file.getBytes());

      return PREFIX + bucketName + "/" + fileName;
    } catch (IOException e) {
      throw new RuntimeException("Upload to GCS failed", e);
    }
  }

  public byte[] download(String fileName) {
    var blob = storage.get(bucketName, fileName);
    Objects.requireNonNull(blob, "File not found");
    return blob.getContent();
  }

  public void delete(String fileName) {
    storage.delete(bucketName, fileName);
  }

  public String generateSignedUrl(String blobName) {
    var blobInfo = BlobInfo.newBuilder(bucketName, blobName).build();
    var url = storage.signUrl(blobInfo, 1, java.util.concurrent.TimeUnit.HOURS, Storage.SignUrlOption.withV4Signature());
    return url.toString();
  }
}
