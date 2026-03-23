package com.capstone.device.domain.model.utils;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Usage {
  LocalDate recordingDate;
  BigDecimal index;
  BigDecimal mass;
  BigDecimal price;
  String meterImageUrl;
  Boolean isPaid;
  String paymentMethod;
}
