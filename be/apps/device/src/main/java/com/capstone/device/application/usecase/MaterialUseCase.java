package com.capstone.device.application.usecase;

import com.capstone.device.application.business.material.MaterialService;
import com.capstone.device.application.dto.request.material.CreateRequest;
import com.capstone.device.application.dto.request.material.UpdateRequest;
import com.capstone.device.application.dto.response.MaterialResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.application.event.producer.material.DeleteEvent;
import com.capstone.device.application.event.producer.material.UpdateEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MaterialUseCase {
  final MaterialService mService;
  final MessageProducer producer;
  static final String PREFIX = ".material-price.";

  @Value("${rabbit-mq-config.queue}" + PREFIX + "${rabbit-mq-config.actions[0]}")
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.queue}" + PREFIX + "${rabbit-mq-config.actions[1]}")
  String DELETE_ROUTING_KEY;

  public MaterialResponse create(@NonNull CreateRequest request) {
    return mService.createMaterial(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public MaterialResponse update(String id, @NonNull UpdateRequest request) {
    var old = mService.getMaterialById(id);
    var n = mService.updateMaterial(id, request);

    producer.send(UPDATE_ROUTING_KEY, new UpdateEvent(
        old.jobContent(), old.price(), old.laborPrice(),
        old.laborPriceAtRuralCommune(), old.constructionMachineryPrice(),
        old.constructionMachineryPriceAtRuralCommune(), old.groupName(), old.unitName(),
        n.jobContent(), n.price(), n.laborPrice(),
        n.laborPriceAtRuralCommune(), n.constructionMachineryPrice(),
        n.constructionMachineryPriceAtRuralCommune(), n.groupName(), n.unitName()));
    return n;
  }

  @Transactional(rollbackFor = Exception.class)
  public void delete(String id) {
    var old = mService.getMaterialById(id);
    mService.deleteMaterial(id);

    producer.send(DELETE_ROUTING_KEY, new DeleteEvent(
        old.jobContent(), old.price(), old.laborPrice(),
        old.laborPriceAtRuralCommune(), old.constructionMachineryPrice(),
        old.constructionMachineryPriceAtRuralCommune(), old.groupName(), old.unitName()));
  }

  public MaterialResponse get(String id) {
    return mService.getMaterialById(id);
  }

  public Page<MaterialResponse> getAll(Pageable pageable) {
    return mService.getAllMaterials(pageable);
  }
}
