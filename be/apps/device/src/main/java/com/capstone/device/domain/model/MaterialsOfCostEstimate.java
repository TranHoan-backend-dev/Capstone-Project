package com.capstone.device.domain.model;

import com.capstone.device.domain.model.utils.MaterialsOfCostEstimateId;
import com.capstone.device.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MaterialsOfCostEstimate {
  @EmbeddedId
  MaterialsOfCostEstimateId id;

  @ManyToOne(fetch = FetchType.EAGER)
  @MapsId("materialId")
  Material material;

  @Column(nullable = false)
  String laborCost;

  @Column(nullable = false)
  String materialCost;

  String note;

  public void setId(MaterialsOfCostEstimateId id) {
    this.id = Objects.requireNonNull(id, Constant.ENT_32);
  }

  public void setMaterial(Material material) {
    this.material = Objects.requireNonNull(material, Constant.ENT_33);
  }

  public void setLaborCost(String laborCost) {
    this.laborCost = Objects.requireNonNull(laborCost, Constant.ENT_30);
    if (laborCost.isBlank())
      throw new IllegalArgumentException(Constant.ENT_30);
  }

  public void setMaterialCost(String materialCost) {
    this.materialCost = Objects.requireNonNull(materialCost, Constant.ENT_31);
    if (materialCost.isBlank())
      throw new IllegalArgumentException(Constant.ENT_31);
  }

  public void setNote(String note) {
    this.note = Objects.requireNonNull(note, Constant.ENT_34);
  }

  public static MaterialsOfCostEstimate create(Consumer<MaterialsOfCostEstimateBuilder> consumer) {
    MaterialsOfCostEstimateBuilder builder = new MaterialsOfCostEstimateBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class MaterialsOfCostEstimateBuilder {
    private final MaterialsOfCostEstimate instance = new MaterialsOfCostEstimate();

    public MaterialsOfCostEstimateBuilder id(MaterialsOfCostEstimateId id) {
      instance.setId(id);
      return this;
    }

    public MaterialsOfCostEstimateBuilder material(Material material) {
      instance.setMaterial(material);
      return this;
    }

    public MaterialsOfCostEstimateBuilder laborCost(String laborCost) {
      instance.setLaborCost(laborCost);
      return this;
    }

    public MaterialsOfCostEstimateBuilder materialCost(String materialCost) {
      instance.setMaterialCost(materialCost);
      return this;
    }

    public MaterialsOfCostEstimateBuilder note(String note) {
      instance.setNote(note);
      return this;
    }

    public MaterialsOfCostEstimate build() {
      Objects.requireNonNull(instance.id, Constant.ENT_32);
      Objects.requireNonNull(instance.material, Constant.ENT_33);
      Objects.requireNonNull(instance.laborCost, Constant.ENT_30);
      Objects.requireNonNull(instance.materialCost, Constant.ENT_31);
      Objects.requireNonNull(instance.note, Constant.ENT_34);
      return instance;
    }
  }
}
