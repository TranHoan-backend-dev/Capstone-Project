package com.capstone.device.domain.model;

import com.capstone.device.domain.model.utils.UsageTarget;
import com.capstone.device.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.math.BigDecimal;
import java.time.LocalDate;
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
public class WaterPrice {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "price_id")
  String priceId;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  UsageTarget usageTarget;

  @OneToMany(fetch = FetchType.EAGER)
  List<PriceType> priceTypes;

  @Column(nullable = false)
  BigDecimal tax;
  BigDecimal environmentPrice;

  @Column(nullable = false)
  LocalDate applicationPeriod;

  @Column(nullable = false)
  LocalDate expirationDate;
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
    this.usageTarget = UsageTarget.valueOf(usageTarget);
  }

  public void setTax(BigDecimal tax) {
    requireNonNullAndNotEmpty(tax, Constant.ENT_19);
    this.tax = tax;
  }

  public void setEnvironmentPrice(BigDecimal environmentPrice) {
    requireNonNullAndNotEmpty(environmentPrice, Constant.ENT_20);
    this.environmentPrice = environmentPrice;
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

    public WaterPriceBuilder tax(BigDecimal tax) {
      wp.setTax(tax);
      return this;
    }

    public WaterPriceBuilder environmentPrice(BigDecimal environmentPrice) {
      wp.setEnvironmentPrice(environmentPrice);
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
