package com.capstone.construction.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "customer", path = "/api/v1", configuration = FeignAuthInterceptor.class)
public interface CustomerService {
  @GetMapping("/contracts/exist")
  Boolean checkExistenceOfContract(@RequestParam("id") String contractId);

  @GetMapping("/customers/count/{id}")
  int count(@PathVariable String id);
}
