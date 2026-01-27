package com.capstone.device.domain.model;

import com.capstone.device.domain.model.id.MaterialsOfCostEstimateId;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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
}
