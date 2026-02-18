package com.capstone.organization.service.impl;

import com.capstone.common.annotation.AppLog;
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
import org.springframework.data.domain.PageRequest;
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

    entity.setName(request.name());
    entity.setPhoneNumber(request.phoneNumber());

    var saved = departmentRepo.save(entity);
    return convert(saved);
  }

  @Override
  public PagedDepartmentResponse getDepartments(int page, int size) {
    log.info("Fetching departments page: {}, size: {}", page, size);

    var result = departmentRepo.findAll(PageRequest.of(page, size));
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

  private DepartmentResponse convert(@NonNull Department department) {
    return new DepartmentResponse(
      department.getDepartmentId(),
      department.getName(),
      department.getPhoneNumber()
    );
  }
}
