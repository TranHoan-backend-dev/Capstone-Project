package com.capstone.device.domain.model;

import com.capstone.device.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OverallWaterMeter {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String meterCode;

  @Column(nullable = false, unique = true)
  String name;

  @Column(nullable = false)
  String lateralId;

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, Constant.ENT_01);
    this.name = name;
  }

  public void setLateralId(String lateralId) {
    requireNonNullAndNotEmpty(lateralId, Constant.ENT_02);
    this.lateralId = lateralId;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static OverallWaterMeter create(@NonNull Consumer<OverallWaterMeterBuilder> consumer) {
    var meter = new OverallWaterMeterBuilder();
    consumer.accept(meter);
    return meter.build();
  }

  public static class OverallWaterMeterBuilder {
    private final OverallWaterMeter unit = new OverallWaterMeter();

    public OverallWaterMeterBuilder name(String name) {
      unit.setName(name);
      return this;
    }

    public OverallWaterMeterBuilder lateralId(String lateralId) {
      unit.setLateralId(lateralId);
      return this;
    }

    public OverallWaterMeter build() {
      return unit;
    }
  }
}
