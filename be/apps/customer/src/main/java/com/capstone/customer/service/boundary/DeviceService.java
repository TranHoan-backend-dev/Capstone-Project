package com.capstone.customer.service.boundary;

import com.capstone.common.config.feign.FeignAuthInterceptor;
import com.capstone.common.response.WrapperApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collection;

@FeignClient(name = "device", path = "/api/v1", configuration = FeignAuthInterceptor.class)
public interface DeviceService {
  @GetMapping("/water-prices/check/{id}")
  Boolean checkExistenceOfWaterPrice(@PathVariable String id);

  @GetMapping("/water-meters/{id}/exists")
  Boolean checkExistenceOfWaterMeter(@PathVariable String id);

  @GetMapping("/water-prices/{id}")
  WrapperApiResponse getWaterPriceById(@PathVariable String id);

  @GetMapping("/usage/batch")
  WrapperApiResponse getUsageBatch(@RequestParam("ids") Collection<String> ids);

  @GetMapping("/water-meters/{id}")
  WrapperApiResponse getWaterMeterById(@PathVariable("id") String id);
}
