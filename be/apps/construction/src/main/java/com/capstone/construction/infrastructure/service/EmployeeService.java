package com.capstone.construction.infrastructure.service;

import com.capstone.common.utils.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Service
@FeignClient(name = "auth", path = "/api/v1/authorization")
public interface EmployeeService {
  @GetMapping("/employees/{id}")
  WrapperApiResponse isEmployeeExisting(@PathVariable String id);

  @GetMapping("/employees/{id}/name")
  WrapperApiResponse getEmployeeNameById(@PathVariable String id);
}
