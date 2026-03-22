package com.capstone.organization.service.impl;

import com.capstone.common.annotation.AppLog;
import com.capstone.organization.dto.request.page.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.page.FilterBusinessPagesRequest;
import com.capstone.organization.dto.request.page.UpdateBusinessPageRequest;
import com.capstone.organization.dto.response.BusinessPageResponse;
import com.capstone.organization.dto.response.PagedBusinessPageResponse;
import com.capstone.organization.event.producer.MessageProducer;
import com.capstone.organization.event.producer.UpdatePageMessage;
import com.capstone.organization.model.BusinessPage;
import com.capstone.organization.repository.BusinessPageRepository;
import com.capstone.organization.service.boundary.BusinessPageService;
import com.capstone.organization.service.boundary.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BusinessPageServiceImpl implements BusinessPageService {
  final BusinessPageRepository businessPageRepository;
  final EmployeeService employeeService;
  Logger log;
  final MessageProducer messageProducer;

  // <editor-fold> desc="constant"
  @Value(".${rabbit-mq-config.entities[0]}.")
  String PREFIX;

  @Value("${rabbit-mq-config.actions[0]}")
  String ACTION;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;
  // </editor-fold>

  @Override
  @Transactional(rollbackFor = Exception.class)
  public BusinessPageResponse createBusinessPage(@NonNull CreateBusinessPageRequest request) {
    log.info("Creating business page with name: {}", request.name());

    var entity = BusinessPage.create(builder -> builder
      .name(request.name())
      .activate(request.activate())
      .creator(request.creator())
      .updator(request.updator())
    );

    var saved = businessPageRepository.save(entity);
    return convert(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public BusinessPageResponse updateBusinessPage(String pageId, @NonNull UpdateBusinessPageRequest request) {
    log.info("Updating business page: {}", pageId);

    var entity = businessPageRepository.findById(pageId)
      .orElseThrow(() -> new IllegalArgumentException("Business page not found"));

    if (request.name() != null && !request.name().isBlank()) {
      entity.setName(request.name());
    }
    if (request.activate() != null) {
      entity.setActivate(request.activate());
    }
    entity.setUpdator(request.updator());

    if (!entity.getActivate()) {
      var routingKey = QUEUE_NAME + PREFIX + ACTION;
      messageProducer.send(routingKey, new UpdatePageMessage(
        entity.getName()
      ));
      messageProducer.sendWithDelay("update-page", entity.getPageId());

      return convert(entity);
    } else {
      var saved = businessPageRepository.save(entity);
      return convert(saved);
    }
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

  @Override
  public List<String> getAllBusinessPageNamesByIds(List<String> ids) {
    log.info("Fetching business pages by ids: {}", ids);
    var result = businessPageRepository.findAllById(ids);
    return result
      .stream()
      .map(BusinessPage::getName)
      .collect(Collectors.toList());
  }

  private @NonNull PagedBusinessPageResponse mapResponse(@NonNull Page<BusinessPage> list) {
    var items = list.getContent().stream()
      .map(this::convert)
      .collect(Collectors.toList());
    return new PagedBusinessPageResponse(
      items,
      list.getNumber(),
      list.getSize(),
      list.getTotalElements(),
      list.getTotalPages()
    );
  }

  private @NonNull BusinessPageResponse convert(@NonNull BusinessPage saved) {
    var creatorName = employeeService.getEmployeeNameById(saved.getCreator()).data();
    var updatorName = employeeService.getEmployeeNameById(saved.getUpdator()).data();
    return new BusinessPageResponse(
      saved.getPageId(),
      saved.getName(),
      saved.getActivate(),
      creatorName.toString(),
      updatorName.toString()
    );
  }
}
