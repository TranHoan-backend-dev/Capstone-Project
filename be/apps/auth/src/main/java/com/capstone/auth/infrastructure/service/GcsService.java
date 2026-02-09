package com.capstone.auth.infrastructure.service;

import com.capstone.auth.infrastructure.config.FeignMultipartConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(
  name = "image",
  path = "/gcs",
  configuration = FeignMultipartConfig.class)
public interface GcsService {
  @PostMapping(
    value = "/upload",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  String upload(@RequestPart("avatar") MultipartFile avatar);
}
