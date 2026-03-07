package com.capstone.device.infrastructure.service;

import com.capstone.common.config.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
  name = "customer",
  path = "/api/v1/customer",
  configuration = FeignAuthInterceptor.class
)
public interface CustomerService {
  /**
   * Kiểm tra xem có khách hàng nào đang áp dụng mức giá nước này hay không
   * @param waterPriceId Id của bản ghi giá nước
   * @return boolean. True for existing, False for not
   */
  @GetMapping("/{price}")
  WrapperApiResponse checkWhetherCustomersAreApplied(@PathVariable("price") @NonNull String waterPriceId);
}
