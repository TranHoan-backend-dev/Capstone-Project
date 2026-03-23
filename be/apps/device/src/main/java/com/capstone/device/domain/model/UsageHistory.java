package com.capstone.device.domain.model;

import com.capstone.device.domain.model.utils.Usage;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
  Stack<Usage> usages;

  @Column(nullable = false, unique = true)
  String customerId;

  public void addNewUsage(Usage usage) {
    Objects.requireNonNull(usage);
    usages.push(usage);
  }

  public Optional<Usage> getLatestUsage() {
    if (usages == null || usages.isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(usages.peek());
  }
}
