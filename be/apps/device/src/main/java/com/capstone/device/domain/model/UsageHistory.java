package com.capstone.device.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.*;

import com.capstone.device.domain.model.utils.Usage;

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

  @Column(name = "customer_id", nullable = false, unique = true)
  String customerId;

  @OneToOne(fetch = FetchType.EAGER)
  @MapsId("usageHistory")
  @JoinColumn(name = "meter_code")
  WaterMeter meter;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  @Builder.Default
  List<Usage> usages = new ArrayList<>();

  public void addOrUpdateUsage(Usage usage) {
    if (usages == null) {
      usages = new ArrayList<>();
    }
    // Remove old usage for same month/year if exists
    usages.removeIf(u -> u.getRecordingDate().getMonth() == usage.getRecordingDate().getMonth() &&
      u.getRecordingDate().getYear() == usage.getRecordingDate().getYear());
    usages.addLast(usage);
  }

  public Usage getLastUsage() {
    return !usages.isEmpty() ? usages.getLast() : null;
  }
}

