package com.capstone.device.domain.model;

import com.capstone.common.utils.SharedMessage;
import com.capstone.device.domain.model.utils.MaterialsOfSettlementId;
import com.capstone.device.infrastructure.util.Message;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.util.Objects;
import java.util.function.Consumer;

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

  @Column(nullable = false)
  String laborCost;

  @Column(nullable = false)
  String materialCost;

  String note;

  public void setId(MaterialsOfSettlementId id) {
    this.id = Objects.requireNonNull(id, SharedMessage.MES_07);
  }

  public void setMaterial(Material material) {
    this.material = Objects.requireNonNull(material, Message.ENT_33);
  }

  public static MaterialsOfSettlement create(@NonNull Consumer<MaterialsOfSettlementBuilder> consumer) {
    MaterialsOfSettlementBuilder builder = new MaterialsOfSettlementBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class MaterialsOfSettlementBuilder {
    private final MaterialsOfSettlement instance = new MaterialsOfSettlement();

    public MaterialsOfSettlementBuilder id(MaterialsOfSettlementId id) {
      instance.setId(id);
      return this;
    }

    public MaterialsOfSettlementBuilder material(Material material) {
      instance.setMaterial(material);
      return this;
    }

    public MaterialsOfSettlement build() {
      Objects.requireNonNull(instance.id, SharedMessage.MES_07);
      Objects.requireNonNull(instance.material, Message.ENT_33);
      Objects.requireNonNull(instance.laborCost, Message.ENT_30);
      Objects.requireNonNull(instance.materialCost, Message.ENT_31);
      Objects.requireNonNull(instance.note, Message.ENT_55);
      return instance;
    }
  }
}
