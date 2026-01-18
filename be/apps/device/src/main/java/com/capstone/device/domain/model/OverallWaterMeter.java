package com.capstone.device.domain.model;

import com.capstone.device.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.util.List;
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
  @Column(name = "meter_code")
  String id;

  @Column(nullable = false)
  String name;

  @Column(nullable = false)
  String lateralId;

  @OneToMany(mappedBy = "overallWaterMeter")
  List<WaterMeter> meters;

  public void setName(String name) {
    Objects.requireNonNull(name, Constant.ENT_01);
    if (name.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_01);
    }
    this.name = name;
  }

  public void setLateralId(String lateralId) {
    Objects.requireNonNull(lateralId, Constant.ENT_02);
    if (lateralId.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_02);
    }
    this.lateralId = lateralId;
  }

  public void setMeters(List<WaterMeter> meters) {
    Objects.requireNonNull(meters, Constant.ENT_03);
    this.meters = meters;
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

    public OverallWaterMeterBuilder meters(List<WaterMeter> meters) {
      unit.setMeters(meters);
      return this;
    }

    public OverallWaterMeter build() {
      return unit;
    }
  }
}
