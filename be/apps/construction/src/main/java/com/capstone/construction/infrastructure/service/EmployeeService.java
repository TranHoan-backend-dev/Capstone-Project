package com.capstone.construction.infrastructure.service;

import com.capstone.common.config.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
  name = "auth",
  path = "/api/v1/authorization",
  configuration = FeignAuthInterceptor.class
)
public interface EmployeeService {
  @GetMapping("/employees/{authorId}")
  WrapperApiResponse isEmployeeExisting(@PathVariable("authorId") String id);

  /**
   * Kiem tra xem id cua nhan vien co ton tai trong he thong thay khong
   * @param id id cua nhan vien
   * @return tra ve true hoac false
   */
  @GetMapping("/employees/{id}/name")
  WrapperApiResponse getEmployeeNameById(@PathVariable String id);
}
