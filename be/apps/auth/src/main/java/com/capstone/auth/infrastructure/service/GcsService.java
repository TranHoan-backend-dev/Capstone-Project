package com.capstone.auth.infrastructure.service;

import org.springframework.cloud.openfeign.FeignClient;
//import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

//@Service
@FeignClient(name = "image", path = "/gcs")
public interface GcsService {
  @PostMapping("/upload")
  String upload(MultipartFile avatar);
}
