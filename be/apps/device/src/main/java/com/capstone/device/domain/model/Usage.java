package com.capstone.device.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usage {
  LocalDateTime recordingDate;
  BigDecimal index;
  BigDecimal mass;
  BigDecimal price;
  String meterImageUrl;
  Boolean isPaid;
  String paymentMethod;
}
