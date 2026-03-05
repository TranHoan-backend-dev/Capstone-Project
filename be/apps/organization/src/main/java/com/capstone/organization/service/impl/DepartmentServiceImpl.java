package com.capstone.organization.service.impl;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.exception.ExistingException;
import com.capstone.organization.dto.request.CreateDepartmentRequest;
import com.capstone.organization.dto.request.UpdateDepartmentRequest;
import com.capstone.organization.dto.response.DepartmentResponse;
import com.capstone.organization.dto.response.PagedDepartmentResponse;
import com.capstone.organization.model.Department;
import com.capstone.organization.repository.DepartmentRepository;
import com.capstone.organization.service.boundary.DepartmentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentServiceImpl implements DepartmentService {
  DepartmentRepository departmentRepo;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public DepartmentResponse createDepartment(@NonNull CreateDepartmentRequest request) {
    log.info("Creating department with name: {}", request.name());

    if (departmentRepo.existsByPhoneNumber(request.phoneNumber())) {
      throw new ExistingException("Phone number already exists");
    }

    if (departmentRepo.existsByNameIgnoreCase(request.name())) {
      throw new ExistingException("Name already exists");
    }

    var entity = Department.create(builder -> builder
      .name(request.name())
      .phoneNumber(request.phoneNumber())
    );

    var saved = departmentRepo.save(entity);
    return convert(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public DepartmentResponse updateDepartment(String departmentId, @NonNull UpdateDepartmentRequest request) {
    log.info("Updating department: {}", departmentId);

    var entity = departmentRepo.findById(departmentId)
      .orElseThrow(() -> new IllegalArgumentException("Department not found"));

    if (departmentRepo.existsByPhoneNumber(request.phoneNumber()) && !entity.getPhoneNumber().equals(request.phoneNumber())) {
      throw new ExistingException("Phone number already exists");
    }

    if (departmentRepo.existsByNameIgnoreCase(request.name()) && !entity.getName().equalsIgnoreCase(request.name())) {
      throw new ExistingException("Name already exists");
    }

    if (request.name() != null && !request.name().isBlank()) {
      entity.setName(request.name());
    }
    if (request.phoneNumber() != null && !request.phoneNumber().isBlank()) {
      entity.setPhoneNumber(request.phoneNumber());
    }

    var saved = departmentRepo.save(entity);
    return convert(saved);
  }

  @Override
  public PagedDepartmentResponse getDepartments(@NonNull Pageable pageable, String keyword) {
    log.info("Fetching departments page: {}, size: {}", pageable.getPageNumber(), pageable.getPageSize());

    var result = keyword == null ? departmentRepo.findAll(pageable) :
      departmentRepo.findByDepartmentIdContainsIgnoreCaseOrNameContainsIgnoreCaseOrPhoneNumberContains(
        keyword, keyword,
        keyword, pageable);
    var items = result.getContent().stream()
      .map(this::convert)
      .collect(Collectors.toList());

    return new PagedDepartmentResponse(
      items,
      result.getNumber(),
      result.getSize(),
      result.getTotalElements(),
      result.getTotalPages()
    );
  }

  @Override
  public boolean checkIfDepartmentExists(String departmentId) {
    return departmentRepo.existsById(departmentId);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteDepartment(String departmentId) {
    log.info("Deleting department with id: {}", departmentId);
    if (!departmentRepo.existsById(departmentId)) {
      throw new IllegalArgumentException("Department not found");
    }
    departmentRepo.deleteById(departmentId);
  }

  private @NonNull DepartmentResponse convert(@NonNull Department department) {
    return new DepartmentResponse(
      department.getDepartmentId(),
      department.getName(),
      department.getPhoneNumber()
    );
  }
}
