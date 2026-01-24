package com.capstone.device.domain.model;

import com.capstone.device.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.math.BigDecimal;
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
public class Supply {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "labor_code")
  String id; // ma hieu nhan cong

  @Column(nullable = false)
  String jobContent;

  @Column(nullable = false, precision = 19, scale = 2)
  BigDecimal price;

  @Column(nullable = false, precision = 19, scale = 2)
  BigDecimal laborPrice;

  @Column(nullable = false, precision = 19, scale = 2)
  BigDecimal laborPriceAtRuralCommune;

  @Column(nullable = false, precision = 19, scale = 2)
  BigDecimal constructionMachineryPrice;

  @Column(nullable = false, precision = 19, scale = 2)
  BigDecimal constructionMachineryPriceAtRuralCommune;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "supplies_group_id")
  SuppliesGroup group;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "calculation_unit_id")
  CalculationUnit unit;

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

  public void setJobContent(String jobContent) {
    Objects.requireNonNull(jobContent, Constant.ENT_04);
    if (jobContent.trim().isEmpty()) {
      throw new IllegalArgumentException(Constant.ENT_04);
    }
    this.jobContent = jobContent;
  }

  public void setPrice(BigDecimal price) {
    requireNonNullAndNotEmpty(price, Constant.ENT_05);
    this.price = price;
  }

  public void setLaborPrice(BigDecimal laborPrice) {
    requireNonNullAndNotEmpty(laborPrice, Constant.ENT_06);
    this.laborPrice = laborPrice;
  }

  public void setLaborPriceAtRuralCommune(BigDecimal laborPriceAtRuralCommune) {
    requireNonNullAndNotEmpty(laborPriceAtRuralCommune, Constant.ENT_07);
    this.laborPriceAtRuralCommune = laborPriceAtRuralCommune;
  }

  public void setConstructionMachineryPrice(BigDecimal constructionMachineryPrice) {
    requireNonNullAndNotEmpty(constructionMachineryPrice, Constant.ENT_08);
    this.constructionMachineryPrice = constructionMachineryPrice;
  }

  public void setConstructionMachineryPriceAtRuralCommune(BigDecimal constructionMachineryPriceAtRuralCommune) {
    requireNonNullAndNotEmpty(constructionMachineryPriceAtRuralCommune, Constant.ENT_09);
    this.constructionMachineryPriceAtRuralCommune = constructionMachineryPriceAtRuralCommune;
  }

  private void requireNonNullAndNotEmpty(BigDecimal value, String message) {
    Objects.requireNonNull(value, message);
    if (value.compareTo(BigDecimal.ZERO) < 0) {
      throw new IllegalArgumentException(message);
    }
  }

  public static Supply create(@NonNull Consumer<SupplyBuilder> consumer) {
    var builder = new SupplyBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class SupplyBuilder {
    private final Supply supply = new Supply();

    public SupplyBuilder jobContent(String jobContent) {
      supply.setJobContent(jobContent);
      return this;
    }

    public SupplyBuilder price(BigDecimal price) {
      supply.setPrice(price);
      return this;
    }

    public SupplyBuilder laborPrice(BigDecimal laborPrice) {
      supply.setLaborPrice(laborPrice);
      return this;
    }

    public SupplyBuilder laborPriceAtRuralCommune(BigDecimal laborPriceAtRuralCommune) {
      supply.setLaborPriceAtRuralCommune(laborPriceAtRuralCommune);
      return this;
    }

    public SupplyBuilder constructionMachineryPrice(BigDecimal constructionMachineryPrice) {
      supply.setConstructionMachineryPrice(constructionMachineryPrice);
      return this;
    }

    public SupplyBuilder constructionMachineryPriceAtRuralCommune(BigDecimal constructionMachineryPriceAtRuralCommune) {
      supply.setConstructionMachineryPriceAtRuralCommune(constructionMachineryPriceAtRuralCommune);
      return this;
    }

    public Supply build() {
      return supply;
    }
  }
}
