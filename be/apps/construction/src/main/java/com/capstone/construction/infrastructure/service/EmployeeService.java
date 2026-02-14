package com.capstone.construction.infrastructure.service;

import com.capstone.common.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Service
@FeignClient(name = "auth", path = "/api/v1/authorization")
public interface EmployeeService {
  @GetMapping("/employees/{authorId}")
  WrapperApiResponse isEmployeeExisting(@PathVariable("authorId") String id);

  @GetMapping("/employees/{id}/name")
  WrapperApiResponse getEmployeeNameById(@PathVariable String id);
}
