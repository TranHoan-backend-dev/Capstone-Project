package com.capstone.construction.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
  name = "device",
  path = "/api/v1/water-meters",
  configuration = FeignAuthInterceptor.class
)
public interface OverallWaterMeterService {
  @GetMapping("/overall/{id}/exists")
  WrapperApiResponse isMeterExisting(@PathVariable String id);

  @DeleteMapping("/overall/lateral")
  WrapperApiResponse deleteWaterMeter(@RequestParam String id);
}
