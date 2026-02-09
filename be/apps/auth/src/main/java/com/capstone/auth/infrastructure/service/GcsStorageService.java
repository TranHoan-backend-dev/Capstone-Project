//package com.capstone.auth.infrastructure.service;
//
//import com.google.cloud.storage.BlobInfo;
//import com.google.cloud.storage.Storage;
//import com.google.cloud.storage.StorageOptions;
//import lombok.AccessLevel;
//import lombok.experimental.FieldDefaults;
//import org.jspecify.annotations.NonNull;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.UUID;
//
//@Service
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
//public class GcsStorageService {
//  Storage storage;
//  String bucketName;
//  static String PREFIX = "https://storage.googleapis.com/";
//
//  public GcsStorageService(
//    @Value("${gcs.bucket}") String bucketName
//  ) {
//    this.storage = StorageOptions.getDefaultInstance().getService();
//    this.bucketName = bucketName;
//  }
//
//  public String upload(@NonNull MultipartFile file, String folder) {
//    try {
//      var fileName = folder + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();
//
//      var blobInfo = BlobInfo.newBuilder(bucketName, fileName)
//        .setContentType(file.getContentType())
//        .build();
//
//      storage.create(blobInfo, file.getBytes());
//
//      return PREFIX + bucketName + "/" + fileName;
//    } catch (IOException e) {
//      throw new RuntimeException("Upload to GCS failed", e);
//    }
//  }
//}
