package com.capstone.device.domain.model;

import com.capstone.common.utils.SharedMessage;
import com.capstone.device.infrastructure.util.Message;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.time.LocalDateTime;
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
public class WaterMeterType {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String typeId;

  @Column(nullable = false)
  String name;

  @Column(nullable = false)
  String origin;

  @Column(nullable = false)
  String meterModel;

  Integer size;

  String maxIndex;

  String qn;

  String qt;

  String qmin;

  Float diameter;

  @Column(nullable = false)
  Integer indexLength;

  @JsonIgnore
  @OneToMany(mappedBy = "type")
  List<WaterMeter> waterMeter;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, SharedMessage.MES_07);
    this.name = name;
  }

  public void setOrigin(String origin) {
    requireNonNullAndNotEmpty(origin, Message.ENT_14);
    this.origin = origin;
  }

  public void setMeterModel(String meterModel) {
    requireNonNullAndNotEmpty(meterModel, Message.ENT_15);
    this.meterModel = meterModel;
  }

  public void setSize(Integer size) {
    if (size != null && size <= 0) {
      throw new IllegalArgumentException(Message.ENT_11);
    }
    this.size = size;
  }

  public void setMaxIndex(String maxIndex) {
    requireNonNullAndNotEmpty(maxIndex, Message.ENT_28);
    this.maxIndex = maxIndex;
  }

  public void setQn(String qn) {
    requireNonNullAndNotEmpty(qn, Message.ENT_26);
    this.qn = qn;
  }

  public void setQt(String qt) {
    requireNonNullAndNotEmpty(qt, Message.ENT_27);
    this.qt = qt;
  }

  public void setQmin(String qmin) {
    requireNonNullAndNotEmpty(qmin, Message.ENT_25);
    this.qmin = qmin;
  }

  public void setDiameter(Float diameter) {
    if (diameter != null && diameter <= 0) {
      throw new IllegalArgumentException(Message.ENT_16);
    }
    this.diameter = diameter;
  }

  public void setIndexLength(Integer indexLength) {
    if (indexLength != null && indexLength <= 0) {
      throw new IllegalArgumentException(SharedMessage.MES_07); // Using MES_07 as a generic "invalid" placeholder if no specific error exists
    }
    this.indexLength = indexLength;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static WaterMeterType create(@NonNull Consumer<WaterMeterTypeBuilder> consumer) {
    var builder = new WaterMeterTypeBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class WaterMeterTypeBuilder {
    private final WaterMeterType type = new WaterMeterType();

    public WaterMeterTypeBuilder name(String name) {
      type.setName(name);
      return this;
    }

    public WaterMeterTypeBuilder origin(String origin) {
      type.setOrigin(origin);
      return this;
    }

    public WaterMeterTypeBuilder meterModel(String meterModel) {
      type.setMeterModel(meterModel);
      return this;
    }

    public WaterMeterTypeBuilder size(Integer size) {
      type.setSize(size);
      return this;
    }

    public WaterMeterTypeBuilder maxIndex(String maxIndex) {
      type.setMaxIndex(maxIndex);
      return this;
    }

    public WaterMeterTypeBuilder qn(String qn) {
      type.setQn(qn);
      return this;
    }

    public WaterMeterTypeBuilder qt(String qt) {
      type.setQt(qt);
      return this;
    }

    public WaterMeterTypeBuilder qmin(String qmin) {
      type.setQmin(qmin);
      return this;
    }

    public WaterMeterTypeBuilder diameter(Float diameter) {
      type.setDiameter(diameter);
      return this;
    }

    public WaterMeterTypeBuilder indexLength(Integer indexLength) {
      type.setIndexLength(indexLength);
      return this;
    }

    public WaterMeterType build() {
      return type;
    }
  }
}
