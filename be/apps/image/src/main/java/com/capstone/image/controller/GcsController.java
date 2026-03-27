package com.capstone.image.controller;

import com.capstone.image.service.GcsStorageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/gcs")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GcsController {
  GcsStorageService storageService;
  static String FOLDER_NAME = "image";

  @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<String> upload(@RequestParam(value = "avatar") MultipartFile file) {

    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body("Failed to upload empty file");
    }
    var avatarUrl = "haha";
//    var avatarUrl = storageService.upload(file, FOLDER_NAME);

    return ResponseEntity.ok(avatarUrl);
  }

  @GetMapping(value = "/download/{file}")
  public ResponseEntity<?> download(@PathVariable("file") String fileName) {
//    var file = storageService.download(fileName);
    byte[] file = null;
    return ResponseEntity.ok()
      .contentType(MediaType.IMAGE_JPEG)
      .body(file);
  }

  @DeleteMapping("/delete/{file}")
  public ResponseEntity<String> delete(@PathVariable("file") String fileName) {
//    storageService.delete(fileName);

    return ResponseEntity.ok("File deleted successfully");
  }

  @GetMapping("/signed-url")
  public ResponseEntity<String> getSignedUrl(@RequestParam("fileName") String fileName) {
    var signedUrl = storageService.generateSignedUrl(fileName);
    return ResponseEntity.ok(signedUrl);
  }
}
