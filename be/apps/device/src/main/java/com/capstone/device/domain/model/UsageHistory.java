package com.capstone.device.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.*;

@Builder
@Setter
@Table
@Getter
@Entity
@ToString(exclude = {"meter"})
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

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  @Builder.Default
  Map<String, BigDecimal> usages = new LinkedHashMap<>();

  public void addOrUpdateUsage(String monthYear, BigDecimal index) {
    if (usages == null) {
      usages = new LinkedHashMap<>();
    }
    usages.put(monthYear, index);
  }
}

