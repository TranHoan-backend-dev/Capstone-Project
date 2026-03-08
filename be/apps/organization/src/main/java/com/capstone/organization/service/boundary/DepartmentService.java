package com.capstone.organization.service.boundary;

import com.capstone.organization.dto.request.CreateDepartmentRequest;
import com.capstone.organization.dto.request.UpdateDepartmentRequest;
import com.capstone.organization.dto.response.DepartmentResponse;
import com.capstone.organization.dto.response.PagedDepartmentResponse;
import org.springframework.data.domain.Pageable;

public interface DepartmentService {
  DepartmentResponse createDepartment(CreateDepartmentRequest request);

  DepartmentResponse updateDepartment(String departmentId, UpdateDepartmentRequest request);

  PagedDepartmentResponse getDepartments(Pageable pageable, String keyword);

  boolean checkIfDepartmentExists(String departmentId);

  void deleteDepartment(String departmentId);
}
