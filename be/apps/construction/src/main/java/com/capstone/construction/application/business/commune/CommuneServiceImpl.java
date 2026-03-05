package com.capstone.construction.application.business.commune;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.dto.request.commune.CreateRequest;
import com.capstone.construction.application.dto.request.commune.UpdateRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Commune;
import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.persistence.HamletRepository;
import com.capstone.construction.infrastructure.persistence.NeighborhoodUnitRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommuneServiceImpl implements CommuneService {
  CommuneRepository communeRepository;
  HamletRepository hamletRepository;
  NeighborhoodUnitRepository neighborhoodUnitRepository;
  @NonFinal
  Logger log;

  @Override
  @Transactional
  public void createCommune(@NonNull CreateRequest request) {
    log.info("Creating new commune with name: {}", request.name());
    if (communeRepository.existsByNameIgnoreCase(request.name())) {
      throw new ExistingItemException("Commune with name " + request.name() + " already exists");
    }

    var commune = Commune.create(builder -> builder
      .name(request.name())
      .type(request.type())
    );

    communeRepository.save(commune);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public CommuneResponse updateCommune(String id, @NonNull UpdateRequest request) {
    log.info("Updating commune with id: {}", id);
    var commune = communeRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Commune not found with id: " + id));

    if (request.name() != null) {
      if (!commune.getName().equalsIgnoreCase(request.name()) && communeRepository.existsByNameIgnoreCase(request.name())) {
        throw new ExistingItemException("Commune with name " + request.name() + " already exists");
      }
      commune.setName(request.name());
    }

    if (request.type() != null && commune.getType() != request.type()) {
      commune.setType(request.type());
    }

    var saved = communeRepository.save(commune);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteCommune(String id) {
    log.info("Deleting commune with id: {}", id);
    if (!communeRepository.existsById(id)) {
      throw new IllegalArgumentException("Commune not found with id: " + id);
    }
    if (hamletRepository.existsByCommune_CommuneId(id)) {
      hamletRepository.deleteByCommune_CommuneId(id);
    }
    if (neighborhoodUnitRepository.existsByCommune_CommuneId(id)) {
      neighborhoodUnitRepository.deleteByCommune_CommuneId(id);
    }
    communeRepository.deleteById(id);
  }

  @Override
  public CommuneResponse getCommuneById(String id) {
    log.info("Fetching commune with id: {}", id);
    return communeRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Commune not found with id: " + id));
  }

  @Override
  public PageResponse<CommuneResponse> getAllCommunes(Pageable pageable) {
    log.info("Fetching all communes with pageable: {}", pageable);
    var page = communeRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private @NonNull CommuneResponse mapToResponse(@NonNull Commune commune) {
    return new CommuneResponse(
      commune.getCommuneId(),
      commune.getName(),
      commune.getType(),
      commune.getCreatedAt().toLocalDate());
  }
}
