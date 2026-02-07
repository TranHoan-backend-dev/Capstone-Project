package com.capstone.organization.service.impl;

import com.capstone.organization.dto.request.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.FilterBusinessPagesRequest;
import com.capstone.organization.dto.request.UpdateBusinessPageRequest;
import com.capstone.organization.dto.response.BusinessPageResponse;
import com.capstone.organization.dto.response.PagedBusinessPageResponse;
import com.capstone.organization.model.BusinessPage;
import com.capstone.organization.repository.BusinessPageRepository;
import com.capstone.organization.service.boundary.BusinessPageService;
import com.capstone.organization.utils.IdEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BusinessPageServiceImpl implements BusinessPageService {
  BusinessPageRepository businessPageRepository;

  @Override
  public BusinessPageResponse createBusinessPage(@NonNull CreateBusinessPageRequest request) {
    log.info("Creating business page with name: {}", request.name());

    var entity = BusinessPage.create(builder -> builder
      .name(request.name())
      .activate(request.activate())
      .creator(request.creator())
      .updator(request.updator())
    );

    var saved = businessPageRepository.save(entity);
    return new BusinessPageResponse(
      IdEncoder.encode(saved.getPageId()),
      saved.getName(),
      saved.getActivate(),
      saved.getCreator(),
      saved.getUpdator()
    );
  }

  @Override
  public BusinessPageResponse updateBusinessPage(String pageId, @NonNull UpdateBusinessPageRequest request) {
    log.info("Updating business page: {}", pageId);

    var entity = businessPageRepository.findById(pageId)
      .orElseThrow(() -> new IllegalArgumentException("Business page not found"));

    entity.setName(request.name());
    entity.setActivate(request.activate());
    entity.setUpdator(request.updator());

    var saved = businessPageRepository.save(entity);
    return new BusinessPageResponse(
      IdEncoder.encode(saved.getPageId()),
      saved.getName(),
      saved.getActivate(),
      saved.getCreator(),
      saved.getUpdator()
    );
  }

  @Override
  public PagedBusinessPageResponse getBusinessPages(@NonNull Pageable pageable) {
    log.info("Fetching business pages page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());

    var result = businessPageRepository.findAll(pageable);

    return mapResponse(result);
  }

  @Override
  public PagedBusinessPageResponse filterBusinessPagesList(@NonNull FilterBusinessPagesRequest req, @NonNull Pageable pageable) {
    log.info("Filter business pages by filter: {} and isActive: {} in page {} and size {}", req.filter(), req.isActive(), pageable.getPageNumber(), pageable.getPageSize());

    var result = businessPageRepository.findByNameAndActivate(req.filter(), req.isActive(), pageable);

    return mapResponse(result);
  }

  private @NonNull PagedBusinessPageResponse mapResponse(@NonNull Page<BusinessPage> list) {
    var items = list.getContent().stream()
      .map(pageEntity -> new BusinessPageResponse(
        IdEncoder.encode(pageEntity.getPageId()),
        pageEntity.getName(),
        pageEntity.getActivate(),
        pageEntity.getCreator(),
        pageEntity.getUpdator()
      ))
      .collect(Collectors.toList());
    return new PagedBusinessPageResponse(
      items,
      list.getNumber(),
      list.getSize(),
      list.getTotalElements(),
      list.getTotalPages()
    );
  }
}
