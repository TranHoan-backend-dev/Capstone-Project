package com.capstone.device.domain.model;

import com.capstone.device.infrastructure.util.Message;
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
  @Column(name = "meter_id")
  String meterId;

  @Column(nullable = false)
  LocalDate installationDate;

  @Column(nullable = false)
  Integer size;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "water_meter_type_id", nullable = false)
  WaterMeterType type;

  public void setInstallationDate(LocalDate installationDate) {
    this.installationDate = Objects.requireNonNull(installationDate, Message.ENT_18);
  }

  public void setSize(Integer size) {
    if (size == null || size <= 0) {
      throw new IllegalArgumentException(Message.ENT_11);
    }
    this.size = size;
  }

  public void setType(WaterMeterType type) {
    Objects.requireNonNull(type, Message.ENT_13);
    this.type = type;
  }

  public static WaterMeter create(@NonNull Consumer<WaterMeterBuilder> consumer) {
    var builder = new WaterMeterBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class WaterMeterBuilder {
    private final WaterMeter meter = new WaterMeter();

    public WaterMeterBuilder meterId(String meterId) {
      meter.meterId = meterId;
      return this;
    }

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
