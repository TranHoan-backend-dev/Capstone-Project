package com.capstone.image.controller;

import com.capstone.image.service.GcsStorageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/gcs")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GcsController {
  GcsStorageService storageService;
  static String FOLDER_NAME = "image";

  @PostMapping(name = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<String> upload(@RequestParam(value = "avatar") MultipartFile file) {
    log.info("Uploading file: {}", file.getOriginalFilename());

    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body("Failed to upload empty file");
    }
    var avatarUrl = storageService.upload(file, FOLDER_NAME);

    return ResponseEntity.ok(avatarUrl);
  }
}
