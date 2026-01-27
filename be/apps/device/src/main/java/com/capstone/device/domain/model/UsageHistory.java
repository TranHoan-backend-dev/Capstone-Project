package com.capstone.device.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UsageHistory {
  @Id
  String usageHistory;

  @OneToOne(fetch = FetchType.EAGER)
  @MapsId("usageHistory")
  @JoinColumn(name = "meter_code")
  WaterMeter meter;

  List<Usage> usages;
}
