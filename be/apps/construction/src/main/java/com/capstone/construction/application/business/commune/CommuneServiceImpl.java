package com.capstone.construction.application.business.commune;

import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Commune;
import com.capstone.construction.domain.repository.CommuneRepository;
import com.capstone.construction.application.exception.ExistingItemException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommuneServiceImpl implements CommuneService {
  CommuneRepository communeRepository;

  @Override
  @Transactional
  public CommuneResponse createCommune(@NonNull CommuneRequest request) {
    log.info("Creating new commune with name: {}", request.name());
    if (communeRepository.existsByName(request.name())) {
      throw new ExistingItemException("Commune with name " + request.name() + " already exists");
    }

    var commune = Commune.create(builder -> builder
      .name(request.name())
      .type(request.type()));

    var saved = communeRepository.save(commune);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public CommuneResponse updateCommune(String id, @NonNull CommuneRequest request) {
    log.info("Updating commune with id: {}", id);
    var commune = communeRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Commune not found with id: " + id));

    if (!commune.getName().equals(request.name()) && communeRepository.existsByName(request.name())) {
      throw new ExistingItemException("Commune with name " + request.name() + " already exists");
    }

    commune.setName(request.name());
    commune.setType(request.type());

    var saved = communeRepository.save(commune);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public void deleteCommune(String id) {
    log.info("Deleting commune with id: {}", id);
    if (!communeRepository.existsById(id)) {
      throw new IllegalArgumentException("Commune not found with id: " + id);
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

  private CommuneResponse mapToResponse(@NonNull Commune commune) {
    return new CommuneResponse(
      commune.getCommuneId(),
      commune.getName(),
      commune.getType(),
      commune.getCreatedAt());
  }
}
