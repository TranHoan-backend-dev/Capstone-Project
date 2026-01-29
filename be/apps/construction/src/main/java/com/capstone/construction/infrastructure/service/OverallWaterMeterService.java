package com.capstone.construction.infrastructure.service;

import com.capstone.construction.application.dto.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

@Service
@FeignClient(name = "device", path = "/api/v1")
public interface OverallWaterMeterService {
  @GetMapping("/meters/{id}")
  WrapperApiResponse isMeterExisting(String id);
}
