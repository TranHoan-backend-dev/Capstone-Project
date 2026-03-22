package com.capstone.auth.infrastructure.service;

import com.capstone.common.config.feign.FeignMultipartConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
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

  @DeleteMapping(value = "/delete/{file}")
  void delete(@PathVariable("file") String fileName);
}
