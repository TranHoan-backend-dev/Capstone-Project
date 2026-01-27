package com.capstone.device.domain.model;

import com.capstone.device.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WaterPrice {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "price_id")
  String priceId;

  @Column(nullable = false)
  String usageTarget;

  @Column(nullable = false)
  Integer area;

  @Column(nullable = false)
  BigDecimal price;

  @Column(nullable = false)
  BigDecimal tax;
  BigDecimal environmentPrice;
  Integer level;

  @Column(nullable = false)
  LocalDate applicationPeriod;
  String description;

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

  public void setUsageTarget(String usageTarget) {
    Objects.requireNonNull(usageTarget, Constant.ENT_17);
    if (usageTarget.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_17);
    }
    this.usageTarget = usageTarget;
  }

  public void setArea(Integer area) {
    Objects.requireNonNull(area, Constant.ENT_18);
    if (area < 0) {
      throw new IllegalArgumentException(Constant.ENT_18);
    }
    this.area = area;
  }

  public void setPrice(BigDecimal price) {
    requireNonNullAndNotEmpty(price, Constant.ENT_05);
    this.price = price;
  }

  public void setTax(BigDecimal tax) {
    requireNonNullAndNotEmpty(tax, Constant.ENT_19);
    this.tax = tax;
  }

  public void setEnvironmentPrice(BigDecimal environmentPrice) {
    requireNonNullAndNotEmpty(environmentPrice, Constant.ENT_20);
    this.environmentPrice = environmentPrice;
  }

  public void setLevel(Integer level) {
    if (level != null && level < 0) {
      throw new IllegalArgumentException(Constant.ENT_21);
    }
    this.level = level;
  }

  public void setApplicationPeriod(LocalDate applicationPeriod) {
    Objects.requireNonNull(applicationPeriod, Constant.ENT_22);
    this.applicationPeriod = applicationPeriod;
  }

  public void setDescription(String description) {
    Objects.requireNonNull(applicationPeriod, Constant.ENT_23);
    this.description = description;
  }

  private void requireNonNullAndNotEmpty(BigDecimal value, String message) {
    Objects.requireNonNull(value, message);
    if (value.compareTo(BigDecimal.ZERO) < 0) {
      throw new IllegalArgumentException(message);
    }
  }

  public static WaterPrice create(@NonNull Consumer<WaterPriceBuilder> consumer) {
    var builder = new WaterPriceBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class WaterPriceBuilder {
    private final WaterPrice wp = new WaterPrice();

    public WaterPriceBuilder usageTarget(String usageTarget) {
      wp.setUsageTarget(usageTarget);
      return this;
    }

    public WaterPriceBuilder area(Integer area) {
      wp.setArea(area);
      return this;
    }

    public WaterPriceBuilder price(BigDecimal price) {
      wp.setPrice(price);
      return this;
    }

    public WaterPriceBuilder tax(BigDecimal tax) {
      wp.setTax(tax);
      return this;
    }

    public WaterPriceBuilder environmentPrice(BigDecimal environmentPrice) {
      wp.setEnvironmentPrice(environmentPrice);
      return this;
    }

    public WaterPriceBuilder level(Integer level) {
      wp.setLevel(level);
      return this;
    }

    public WaterPriceBuilder applicationPeriod(LocalDate applicationPeriod) {
      wp.setApplicationPeriod(applicationPeriod);
      return this;
    }

    public WaterPriceBuilder description(String description) {
      wp.setDescription(description);
      return this;
    }

    public WaterPrice build() {
      return wp;
    }
  }
}
