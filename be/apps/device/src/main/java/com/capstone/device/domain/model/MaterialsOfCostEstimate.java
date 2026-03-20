package com.capstone.device.domain.model;

import com.capstone.device.domain.model.utils.MaterialsOfCostEstimateId;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Table
@Getter
@Entity
@Setter
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

  String totalLaborCost;

  String totalMaterialCost;

  String note;

  @Column(nullable = false)
  Float mass;

  @Column(nullable = false, columnDefinition = "NUMERIC(38,2) DEFAULT 0")
  Float reductionCoefficient;
}
