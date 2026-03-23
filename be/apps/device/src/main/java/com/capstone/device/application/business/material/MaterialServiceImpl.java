package com.capstone.device.application.business.material;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.dto.request.material.CreateRequest;
import com.capstone.device.application.dto.request.material.SearchRequest;
import com.capstone.device.application.dto.request.material.UpdateRequest;
import com.capstone.device.application.dto.response.material.MaterialResponse;
import com.capstone.device.domain.model.Material;
import com.capstone.device.domain.model.MaterialsGroup;
import com.capstone.device.infrastructure.persistence.*;
import com.capstone.device.infrastructure.util.Message;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MaterialServiceImpl implements MaterialService {
  MaterialRepository mRepo;
  MaterialsGroupRepository gRepo;
  UnitRepository uRepo;
  MaterialsOfCostEstimateRepository mceRepo;
  MaterialsOfSettlementRepository msRepo;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public MaterialResponse createMaterial(@NonNull CreateRequest request) {
    log.info("Creating material: {}", request.jobContent());

    var group = gRepo.findById(request.groupId())
      .orElseThrow(() -> new IllegalArgumentException("Material group not found: " + request.groupId()));

    var unit = uRepo.findById(request.unitId())
      .orElseThrow(() -> new IllegalArgumentException("Unit not found: " + request.unitId()));

    var material = Material.create(builder -> builder
      .laborCode(request.laborCode())
      .jobContent(request.jobContent())
      .price(request.price())
      .laborPrice(request.laborPrice())
      .laborPriceAtRuralCommune(request.laborPriceAtRuralCommune())
      .constructionMachineryPrice(request.constructionMachineryPrice())
      .constructionMachineryPriceAtRuralCommune(request.constructionMachineryPriceAtRuralCommune())
      .group(group)
      .unit(unit));

    var saved = mRepo.save(material);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public MaterialResponse updateMaterial(String id, @NonNull UpdateRequest request) {
    log.info("Updating material ID: {}", id);
    var material = mRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Material not found: " + id));

    if (request.jobContent() != null && !request.jobContent().isBlank()) {
      material.setJobContent(request.jobContent());
    }
    if (request.price() != null) {
      material.setPrice(request.price());
    }
    if (request.laborPrice() != null) {
      material.setLaborPrice(request.laborPrice());
    }
    if (request.laborPriceAtRuralCommune() != null) {
      material.setLaborPriceAtRuralCommune(request.laborPriceAtRuralCommune());
    }
    if (request.constructionMachineryPrice() != null) {
      material.setConstructionMachineryPrice(request.constructionMachineryPrice());
    }
    if (request.constructionMachineryPriceAtRuralCommune() != null) {
      material.setConstructionMachineryPriceAtRuralCommune(request.constructionMachineryPriceAtRuralCommune());
    }
    if (request.groupId() != null) {
      var group = gRepo.findById(request.groupId())
        .orElseThrow(() -> new IllegalArgumentException(String.format(Message.ENT_01, request.groupId())));
      material.setGroup(group);
    }
    if (request.unitId() != null) {
      var unit = uRepo.findById(request.unitId())
        .orElseThrow(() -> new IllegalArgumentException(String.format(Message.ENT_56, request.unitId())));
      material.setUnit(unit);
    }

    var updated = mRepo.save(material);
    return mapToResponse(updated);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteMaterial(String id) {
    log.info("Deleting material ID: {}", id);
    if (mceRepo.existsByMaterial_MaterialId(id)) {
      mceRepo.deleteByMaterial_MaterialId(id);
    }
    if (msRepo.existsByMaterial_MaterialId(id)) {
      msRepo.deleteByMaterial_MaterialId(id);
    }
    if (!mRepo.existsById(id)) {
      throw new IllegalArgumentException("Material not found: " + id);
    }
    mRepo.deleteById(id);
  }

  @Override
  public MaterialResponse getMaterialById(String id) {
    log.info("Fetching material ID: {}", id);
    return mRepo.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Material not found: " + id));
  }

  @Override
  public Page<MaterialResponse> getAllMaterials(Pageable pageable) {
    log.debug("Fetching all materials with pagination: {}", pageable);
    return mRepo.findAll(pageable).map(this::mapToResponse);
  }

  @Override
  public Page<MaterialResponse> searchMaterials(@NonNull SearchRequest request, Pageable pageable) {
    log.info("Searching materials with criteria: jobContent={}, laborCode={}, groupId={}, minPrice={}, maxPrice={}",
        request.getJobContent(), request.getLaborCode(), request.getGroupId(), request.getMinPrice(), request.getMaxPrice());

    var jobContent = (request.getJobContent() != null && !request.getJobContent().isBlank()) ? request.getJobContent() : null;
    var laborCode = (request.getLaborCode() != null && !request.getLaborCode().isBlank()) ? request.getLaborCode() : null;
    var groupId = (request.getGroupId() != null && !request.getGroupId().isBlank()) ? request.getGroupId() : null;

    return mRepo.searchMaterials(
        jobContent,
        laborCode,
        groupId,
        request.getMinPrice(),
        request.getMaxPrice(),
        pageable
    ).map(this::mapToResponse);
  }

  @Override
  public boolean materialExists(String id) {
    log.info("Checking material ID: {}", id);
    return mRepo.existsById(id);
  }

  @Override
  public void createGroup(String name) {
    log.info("Creating group: {}", name);
    if (gRepo.existsByNameIgnoreCase(name)) {
      throw new IllegalArgumentException("Material group already exists: " + name);
    }
    var entity = MaterialsGroup.create(b -> b.name(name));
    gRepo.save(entity);
  }

  @Override
  public void deleteGroup(String id) {
    log.info("Deleting group: {}", id);
    if (!gRepo.existsById(id)) {
      throw new IllegalArgumentException("Material group not found: " + id);
    }
    if (mRepo.existsByGroup_GroupId(id)) {
      throw new IllegalArgumentException("This material group still in use: " + id);
    }
    gRepo.deleteById(id);
  }

  @Override
  public void updateGroup(String id, @NonNull String name) {
    log.info("Updating group: {}", id);
    var entity = gRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Material group not found: " + id));
    if (gRepo.existsByNameIgnoreCase(name) && !entity.getName().equalsIgnoreCase(name)) {
      throw new IllegalArgumentException("Material group already exists: " + name);
    }
    entity.setName(name);
    gRepo.save(entity);
  }

  @Override
  public List<MaterialResponse> getDefaultMaterial() {
    return mRepo.findAll(PageRequest.of(0, 20))
      .getContent().stream().map(this::mapToResponse).toList();
  }

  private @NonNull MaterialResponse mapToResponse(@NonNull Material material) {
    return new MaterialResponse(
      material.getMaterialId(),
      material.getLaborCode(),
      material.getJobContent(),
      material.getPrice(),
      material.getLaborPrice(),
      material.getLaborPriceAtRuralCommune(),
      material.getConstructionMachineryPrice(),
      material.getConstructionMachineryPriceAtRuralCommune(),
      material.getGroup() != null ? material.getGroup().getName() : null,
      material.getUnit() != null ? material.getUnit().getName() : null,
      material.getCreatedAt(),
      material.getUpdatedAt());
  }
}
