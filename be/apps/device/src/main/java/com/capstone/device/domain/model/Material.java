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
public class Material {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String labor_code; // ma hieu nhan cong

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
  MaterialsGroup group;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "calculation_unit_id")
  Unit unit;

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

  public static Material create(@NonNull Consumer<SupplyBuilder> consumer) {
    var builder = new SupplyBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class SupplyBuilder {
    private final Material material = new Material();

    public SupplyBuilder jobContent(String jobContent) {
      material.setJobContent(jobContent);
      return this;
    }

    public SupplyBuilder price(BigDecimal price) {
      material.setPrice(price);
      return this;
    }

    public SupplyBuilder laborPrice(BigDecimal laborPrice) {
      material.setLaborPrice(laborPrice);
      return this;
    }

    public SupplyBuilder laborPriceAtRuralCommune(BigDecimal laborPriceAtRuralCommune) {
      material.setLaborPriceAtRuralCommune(laborPriceAtRuralCommune);
      return this;
    }

    public SupplyBuilder constructionMachineryPrice(BigDecimal constructionMachineryPrice) {
      material.setConstructionMachineryPrice(constructionMachineryPrice);
      return this;
    }

    public SupplyBuilder constructionMachineryPriceAtRuralCommune(BigDecimal constructionMachineryPriceAtRuralCommune) {
      material.setConstructionMachineryPriceAtRuralCommune(constructionMachineryPriceAtRuralCommune);
      return this;
    }

    public Material build() {
      return material;
    }
  }
}
