package com.capstone.device.domain.model;

import com.capstone.device.domain.model.utils.MaterialsOfSettlementId;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MaterialsOfSettlement {
  @EmbeddedId
  MaterialsOfSettlementId id;

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @MapsId("materialId")
  Material material;

  String laborCost;

  String materialCost;

  String note;

  @Setter
  @Column(nullable = false)
  Float mass;
}
