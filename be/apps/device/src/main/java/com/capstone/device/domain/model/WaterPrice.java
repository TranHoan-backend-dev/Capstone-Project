package com.capstone.device.domain.model;

import com.capstone.common.enumerate.UsageTarget;
import com.capstone.device.infrastructure.util.Message;
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

  @ManyToMany(fetch = FetchType.EAGER)
  List<PriceType> priceTypes;

  @Column(nullable = false)
  BigDecimal tax;
  BigDecimal environmentPrice;

  @Column(nullable = false)
  LocalDate applicationPeriod;

  @Column(nullable = false)
  LocalDate expirationDate;

  @Column(nullable = false, unique = true)
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

  public void setUsageTarget(UsageTarget usageTarget) {
    Objects.requireNonNull(usageTarget, Message.ENT_17);
    this.usageTarget = usageTarget;
  }

  public void setTax(BigDecimal tax) {
    requireNonNullAndNotEmpty(tax, Message.ENT_19);
    this.tax = tax;
  }

  public void setEnvironmentPrice(BigDecimal environmentPrice) {
    requireNonNullAndNotEmpty(environmentPrice, Message.ENT_20);
    this.environmentPrice = environmentPrice;
  }

  public void setApplicationPeriod(LocalDate applicationPeriod) {
    Objects.requireNonNull(applicationPeriod, Message.ENT_22);
    this.applicationPeriod = applicationPeriod;
  }

  public void setExpirationDate(LocalDate expirationDate) {
    this.expirationDate = Objects.requireNonNull(expirationDate, Message.ENT_37);
  }

  public void setDescription(String description) {
    Objects.requireNonNull(description, Message.ENT_23);
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

    public WaterPriceBuilder priceId(String priceId) {
      wp.priceId = priceId;
      return this;
    }

    public WaterPriceBuilder priceTypes(java.util.List<PriceType> priceTypes) {
      wp.priceTypes = priceTypes;
      return this;
    }

    public WaterPriceBuilder usageTarget(UsageTarget usageTarget) {
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

    public void expirationDate(LocalDate expirationDate) {
      wp.setExpirationDate(expirationDate);
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
