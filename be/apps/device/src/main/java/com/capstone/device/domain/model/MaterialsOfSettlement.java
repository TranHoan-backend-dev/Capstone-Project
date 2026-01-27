package com.capstone.device.domain.model;

import com.capstone.device.domain.model.id.MaterialsOfSettlementId;
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
public class MaterialsOfSettlement {
  @EmbeddedId
  MaterialsOfSettlementId id;

  @ManyToOne(fetch = FetchType.EAGER)
  @MapsId("materialId")
  Material material;
}
