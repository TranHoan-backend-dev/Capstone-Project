package com.capstone.auth.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
  name = "organization",
  path = "/api/v1",
  configuration = FeignAuthInterceptor.class
)
public interface OrganizationService {
  @GetMapping(value = "/business-pages/e")
  WrapperApiResponse getPagesByIds(@RequestParam("id") String id);

  @GetMapping("/departments/exist/{id}")
  Boolean checkDepartmentExistence(@PathVariable String id);

  @GetMapping("/departments/name/{id}")
  String getDepartmentName(@PathVariable String id);

  @GetMapping("/jobs/exist/{id}")
  Boolean checkJobExistence(@PathVariable String id);
}
