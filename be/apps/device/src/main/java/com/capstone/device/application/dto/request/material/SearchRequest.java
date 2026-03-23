package com.capstone.device.application.dto.request.material;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequest {
  private String laborCode;
  private String jobContent;
  private BigDecimal minPrice;
  private BigDecimal maxPrice;
  private String groupId;
}
