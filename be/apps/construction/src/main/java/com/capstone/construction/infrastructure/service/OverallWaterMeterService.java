package com.capstone.construction.infrastructure.service;

import com.capstone.construction.application.dto.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;

@Service
@FeignClient(name = "device", path = "/api/v1")
public interface OverallWaterMeterService {
  WrapperApiResponse isMeterExisting(String id);
}
