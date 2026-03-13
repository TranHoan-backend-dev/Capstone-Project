package com.capstone.auth.infrastructure.service;

import com.capstone.common.config.FeignAuthInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
  name = "construction",
  path = "/api/v1/networks",
  configuration = FeignAuthInterceptor.class
)
public interface NetworkService {
  @GetMapping("/exist/{id}")
  Boolean checkExistence(@PathVariable String id);

  @GetMapping("/name/{id}")
  String getNameById(@PathVariable String id);
}
