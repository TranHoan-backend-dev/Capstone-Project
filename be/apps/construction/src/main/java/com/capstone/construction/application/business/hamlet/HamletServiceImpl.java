package com.capstone.construction.application.business.hamlet;

import com.capstone.construction.application.dto.request.catalog.HamletRequest;
import com.capstone.construction.application.dto.response.catalog.HamletResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Hamlet;
import com.capstone.construction.infrastructure.persistence.HamletRepository;
import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
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
public class HamletServiceImpl implements HamletService {
  HamletRepository hamletRepository;
  CommuneRepository communeRepository;

  @Override
  @Transactional
  public HamletResponse createHamlet(@NonNull HamletRequest request) {
    log.info("Creating new hamlet with name: {}", request.name());
    if (hamletRepository.existsByName(request.name())) {
      throw new ExistingItemException("Hamlet with name " + request.name() + " already exists");
    }

    var commune = communeRepository.findById(request.communeId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_26));

    var hamlet = Hamlet.create(builder -> builder
      .name(request.name())
      .type(request.type())
      .commune(commune));

    var saved = hamletRepository.save(hamlet);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public HamletResponse updateHamlet(String id, @NonNull HamletRequest request) {
    log.info("Updating hamlet with id: {}", id);
    var hamlet = hamletRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Hamlet not found with id: " + id));

    if (!hamlet.getName().equals(request.name()) && hamletRepository.existsByName(request.name())) {
      throw new ExistingItemException("Hamlet with name " + request.name() + " already exists");
    }

    var commune = communeRepository.findById(request.communeId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_26));

    hamlet.setName(request.name());
    hamlet.setType(request.type());
    hamlet.setCommune(commune);

    var saved = hamletRepository.save(hamlet);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public void deleteHamlet(String id) {
    log.info("Deleting hamlet with id: {}", id);
    if (!hamletRepository.existsById(id)) {
      throw new IllegalArgumentException("Hamlet not found with id: " + id);
    }
    hamletRepository.deleteById(id);
  }

  @Override
  public HamletResponse getHamletById(String id) {
    log.info("Fetching hamlet with id: {}", id);
    return hamletRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Hamlet not found with id: " + id));
  }

  @Override
  public PageResponse<HamletResponse> getAllHamlets(Pageable pageable) {
    log.info("Fetching all hamlets with pageable: {}", pageable);
    var page = hamletRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private HamletResponse mapToResponse(@NonNull Hamlet hamlet) {
    return new HamletResponse(
      hamlet.getHamletId(),
      hamlet.getName(),
      hamlet.getType(),
      hamlet.getCommune().getCommuneId(),
      hamlet.getCommune().getName(),
      hamlet.getCreatedAt());
  }
}
