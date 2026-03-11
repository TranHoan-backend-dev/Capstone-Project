package com.capstone.device.infrastructure.service;

import com.capstone.common.config.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "auth", path = "/api/v1/authorization/employees", configuration = FeignAuthInterceptor.class)
public interface EmployeeService {
  @GetMapping("/{id}/name")
  WrapperApiResponse getEmployeeName(@PathVariable String id);

  @GetMapping("/{id}")
  WrapperApiResponse checkAuthorExisting(@PathVariable String id);
}
