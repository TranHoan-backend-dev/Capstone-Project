package com.capstone.device.domain.model;

import com.capstone.device.domain.model.utils.Usage;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
  List<Usage> usages;

  @Column(nullable = false, unique = true)
  String customerId;

  public void addNewUsage(Usage usage) {
    Objects.requireNonNull(usage);
    usages.add(usage);
  }

  public Optional<Usage> getLatestUsage() {
    if (usages == null || usages.isEmpty()) {
      return Optional.empty();
    }
    return usages.stream()
      .filter(u -> u.getRecordingDate() != null)
      .max(Comparator.comparing(Usage::getRecordingDate));
  }
}
