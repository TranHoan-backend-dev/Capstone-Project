package com.capstone.device.domain.model.utils;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Usage implements Serializable {
  LocalDate recordingDate;
  BigDecimal index;
  BigDecimal mass;
  BigDecimal price;
  String meterImageUrl;
  Boolean isPaid;
  String paymentMethod;
}
