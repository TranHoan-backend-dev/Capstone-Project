package com.capstone.device.application.business.impl;

import com.capstone.device.application.business.boundary.MaterialService;
import com.capstone.device.application.dto.request.MaterialRequest;
import com.capstone.device.application.dto.response.MaterialResponse;
import com.capstone.device.domain.model.Material;
import com.capstone.device.domain.model.MaterialsGroup;
import com.capstone.device.domain.model.Unit;
import com.capstone.device.infrastructure.persistence.MaterialRepository;
import com.capstone.device.infrastructure.persistence.MaterialsGroupRepository;
import com.capstone.device.infrastructure.persistence.UnitRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of MaterialService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MaterialServiceImpl implements MaterialService {
    MaterialRepository materialRepository;
    MaterialsGroupRepository groupRepository;
    UnitRepository unitRepository;

    @Override
    @Transactional
    public MaterialResponse createMaterial(MaterialRequest request) {
        log.info("Creating material: {}", request.jobContent());

        MaterialsGroup group = null;
        if (request.groupId() != null) {
            group = groupRepository.findById(request.groupId())
                    .orElseThrow(() -> new IllegalArgumentException("Material group not found: " + request.groupId()));
        }

        Unit unit = null;
        if (request.unitId() != null) {
            unit = unitRepository.findById(request.unitId())
                    .orElseThrow(() -> new IllegalArgumentException("Unit not found: " + request.unitId()));
        }

        final MaterialsGroup finalGroup = group;
        final Unit finalUnit = unit;
        var material = Material.create(builder -> {
            builder.jobContent(request.jobContent())
                    .price(request.price())
                    .laborPrice(request.laborPrice())
                    .laborPriceAtRuralCommune(request.laborPriceAtRuralCommune())
                    .constructionMachineryPrice(request.constructionMachineryPrice())
                    .constructionMachineryPriceAtRuralCommune(request.constructionMachineryPriceAtRuralCommune());
            if (finalGroup != null)
                builder.group(finalGroup);
            if (finalUnit != null)
                builder.unit(finalUnit);
        });

        var saved = materialRepository.save(material);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public MaterialResponse updateMaterial(String id, MaterialRequest request) {
        log.info("Updating material ID: {}", id);
        var material = materialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Material not found: " + id));

        material.setJobContent(request.jobContent());
        material.setPrice(request.price());
        material.setLaborPrice(request.laborPrice());
        material.setLaborPriceAtRuralCommune(request.laborPriceAtRuralCommune());
        material.setConstructionMachineryPrice(request.constructionMachineryPrice());
        material.setConstructionMachineryPriceAtRuralCommune(request.constructionMachineryPriceAtRuralCommune());

        var updated = materialRepository.save(material);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMaterial(String id) {
        log.info("Deleting material ID: {}", id);
        if (!materialRepository.existsById(id)) {
            throw new IllegalArgumentException("Material not found: " + id);
        }
        materialRepository.deleteById(id);
    }

    @Override
    public MaterialResponse getMaterialById(String id) {
        log.info("Fetching material ID: {}", id);
        return materialRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Material not found: " + id));
    }

    @Override
    public Page<MaterialResponse> getAllMaterials(Pageable pageable) {
        log.debug("Fetching all materials with pagination: {}", pageable);
        return materialRepository.findAll(pageable).map(this::mapToResponse);
    }

    private MaterialResponse mapToResponse(Material material) {
        return new MaterialResponse(
                material.getLabor_code(),
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
