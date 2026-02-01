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

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_meter_type_id")
  WaterMeterType type;

  public void setInstallationDate(LocalDate installationDate) {
    this.installationDate = Objects.requireNonNull(installationDate, Constant.ENT_10);
  }

  public void setSize(Integer size) {
    if (size == null || size <= 0) {
      throw new IllegalArgumentException(Constant.ENT_11);
    }
    this.size = size;
  }

  public void setType(WaterMeterType type) {
    Objects.requireNonNull(type, Constant.ENT_13);
    this.type = type;
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

    public WaterMeterBuilder type(WaterMeterType type) {
      meter.setType(type);
      return this;
    }

    public WaterMeter build() {
      return meter;
    }
  }
}
