package com.capstone.customer.service.boundary;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
  name = "construction",
  path = "/api/v1/installation-forms",
  configuration = FeignAuthInterceptor.class
)
public interface ConstructionService {
  @GetMapping("/exist")
  Boolean checkExistence(@RequestParam String formCode, @RequestParam String formNumber);
}
