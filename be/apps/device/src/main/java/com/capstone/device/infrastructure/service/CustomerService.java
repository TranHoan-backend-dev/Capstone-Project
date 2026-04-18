package com.capstone.device.infrastructure.service;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import org.jspecify.annotations.NonNull;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
  name = "customer",
  path = "/api/v1",
  configuration = FeignAuthInterceptor.class
)
public interface CustomerService {
  /**
   * Kiểm tra xem có khách hàng nào đang áp dụng mức giá nước này hay không
   *
   * @param waterPriceId Id của bản ghi giá nước
   * @return boolean. True for existing, False for not
   */
  @GetMapping("/customers/water-price/{price}")
  WrapperApiResponse checkWhetherCustomersAreApplied(@PathVariable("price") @NonNull String waterPriceId);

  @GetMapping("/customers/{id}")
  WrapperApiResponse getCustomerById(@PathVariable("id") @NonNull String customerId);

  @GetMapping("/customers/meter/{meterId}")
  String getCustomerIdByMeterId(@PathVariable String meterId);

  @GetMapping("/roadmap-customers/{roadmapId}")
  WrapperApiResponse getCustomersByRoadmapId(@PathVariable("roadmapId") @NonNull String roadmapId);

  @GetMapping("/free/{customerId}")
  Boolean isCustomerFree(@PathVariable String customerId);
}
