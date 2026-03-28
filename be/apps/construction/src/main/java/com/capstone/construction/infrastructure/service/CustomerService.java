package com.capstone.construction.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(
  name = "customer",
  path = "/api/v1",
  configuration = FeignAuthInterceptor.class
)
public interface CustomerService {
  @GetMapping("/contracts/exist")
  Boolean checkExistenceOfContract(String contractId);
}
