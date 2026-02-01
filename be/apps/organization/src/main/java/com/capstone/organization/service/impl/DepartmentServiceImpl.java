package com.capstone.organization.service.impl;

import com.capstone.organization.dto.request.CreateDepartmentRequest;
import com.capstone.organization.dto.request.UpdateDepartmentRequest;
import com.capstone.organization.dto.response.DepartmentResponse;
import com.capstone.organization.dto.response.PagedDepartmentResponse;
import com.capstone.organization.model.Department;
import com.capstone.organization.repository.DepartmentRepository;
import com.capstone.organization.service.boundary.DepartmentService;
import com.capstone.organization.utils.IdEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentServiceImpl implements DepartmentService {
  DepartmentRepository departmentRepo;

  @Override
  public DepartmentResponse createDepartment(@NonNull CreateDepartmentRequest request) {
    log.info("Creating department with name: {}", request.name());

    var entity = Department.create(builder -> builder
      .name(request.name())
      .phoneNumber(request.phoneNumber())
    );

    var saved = departmentRepo.save(entity);
    return new DepartmentResponse(
      IdEncoder.encode(saved.getDepartmentId()),
      saved.getName(),
      saved.getPhoneNumber()
    );
  }

  @Override
  public DepartmentResponse updateDepartment(String departmentId, @NonNull UpdateDepartmentRequest request) {
    log.info("Updating department: {}", departmentId);

    var entity = departmentRepo.findById(departmentId)
      .orElseThrow(() -> new IllegalArgumentException("Department not found"));

    entity.setName(request.name());
    entity.setPhoneNumber(request.phoneNumber());

    var saved = departmentRepo.save(entity);
    return new DepartmentResponse(
      IdEncoder.encode(saved.getDepartmentId()),
      saved.getName(),
      saved.getPhoneNumber()
    );
  }

  @Override
  public PagedDepartmentResponse getDepartments(int page, int size) {
    log.info("Fetching departments page: {}, size: {}", page, size);

    var result = departmentRepo.findAll(PageRequest.of(page, size));
    var items = result.getContent().stream()
      .map(department -> new DepartmentResponse(
        IdEncoder.encode(department.getDepartmentId()),
        department.getName(),
        department.getPhoneNumber()
      ))
      .collect(Collectors.toList());

    return new PagedDepartmentResponse(
      items,
      result.getNumber(),
      result.getSize(),
      result.getTotalElements(),
      result.getTotalPages()
    );
  }
}
