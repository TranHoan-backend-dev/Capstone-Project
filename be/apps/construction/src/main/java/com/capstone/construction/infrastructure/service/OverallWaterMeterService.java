package com.capstone.construction.infrastructure.service;

import com.capstone.common.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Service
@FeignClient(name = "device", path = "/api/v1")
public interface OverallWaterMeterService {
  @GetMapping("/water-meters/{id}/exists")
  WrapperApiResponse isMeterExisting(@PathVariable String id);
}
