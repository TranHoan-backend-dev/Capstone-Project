package com.capstone.customer.service.boundary;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
  name = "construction",
  path = "/api/v1",
  configuration = FeignAuthInterceptor.class
)
public interface ConstructionService {
  @GetMapping("/installation-forms/exist")
  Boolean checkExistence(@RequestParam String formCode, @RequestParam String formNumber);

  @GetMapping("/roadmaps/exist/{id}")
  Boolean isExistingRoadmap(@PathVariable String id);

  @PostMapping("/installation-forms/contract-status")
  void updateContractStatus(@RequestParam String formCode, @RequestParam String formNumber);
}
