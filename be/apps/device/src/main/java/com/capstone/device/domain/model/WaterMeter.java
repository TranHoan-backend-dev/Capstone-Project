package com.capstone.device.domain.model;

import com.capstone.device.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.time.LocalDate;
import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WaterMeter {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "meter_code")
  String id;

  @Column(nullable = false)
  LocalDate installationDate;

  @Column(nullable = false)
  Integer size;

  @Column(nullable = false)
  Double meterIndex;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_meter_type_id")
  WaterMeterType type;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "overall_water_meter_id")
  OverallWaterMeter overallWaterMeter;

  public void setInstallationDate(LocalDate installationDate) {
    this.installationDate = Objects.requireNonNull(installationDate, Constant.ENT_10);
  }

  public void setSize(Integer size) {
    if (size == null || size <= 0) {
      throw new IllegalArgumentException(Constant.ENT_11);
    }
    this.size = size;
  }

  public void setMeterIndex(Double meterIndex) {
    if (meterIndex == null || meterIndex < 0) {
      throw new IllegalArgumentException(Constant.ENT_12);
    }
    this.meterIndex = meterIndex;
  }

  public void setType(WaterMeterType type) {
    Objects.requireNonNull(type, Constant.ENT_13);
    this.type = type;
  }

  public void setOverallWaterMeter(OverallWaterMeter overallWaterMeter) {
    Objects.requireNonNull(type, Constant.ENT_29);
    this.overallWaterMeter = overallWaterMeter;
  }

  public static WaterMeter create(@NonNull Consumer<WaterMeterBuilder> consumer) {
    var builder = new WaterMeterBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class WaterMeterBuilder {
    private final WaterMeter meter = new WaterMeter();

    public WaterMeterBuilder installationDate(LocalDate installationDate) {
      meter.setInstallationDate(installationDate);
      return this;
    }

    public WaterMeterBuilder size(Integer size) {
      meter.setSize(size);
      return this;
    }

    public WaterMeterBuilder meterIndex(Double meterIndex) {
      meter.setMeterIndex(meterIndex);
      return this;
    }

    public WaterMeterBuilder type(WaterMeterType type) {
      meter.setType(type);
      return this;
    }

    public WaterMeterBuilder overallWaterMeter(OverallWaterMeter overallWaterMeter) {
      meter.setOverallWaterMeter(overallWaterMeter);
      return this;
    }

    public WaterMeter build() {
      return meter;
    }
  }
}
