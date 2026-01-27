package com.capstone.device.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Usage {
  LocalDateTime recordingDate;
  BigDecimal index;
  BigDecimal mass;
  BigDecimal price;
  String meterImageUrl;
  Boolean isPaid;
  String paymentMethod;
}
