package com.capstone.device.infrastructure.service;

import com.capstone.common.config.feign.FeignMultipartConfig;
import com.capstone.device.application.dto.response.AIResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(
  name = "ai-service",
  url = "${ai-service.url}",
  configuration = FeignMultipartConfig.class
)
public interface AIService {
  @PostMapping(value = "/predict", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  AIResponse sendWaterMeterImage(@RequestPart("file") MultipartFile file);
}
