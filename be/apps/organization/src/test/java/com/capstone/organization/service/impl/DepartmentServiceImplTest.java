package com.capstone.organization.service.impl;

import com.capstone.organization.dto.request.CreateDepartmentRequest;
import com.capstone.organization.dto.request.UpdateDepartmentRequest;
import com.capstone.organization.model.Department;
import com.capstone.organization.repository.DepartmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DepartmentServiceImplTest {
  @Mock
  DepartmentRepository departmentRepo;

  @InjectMocks
  DepartmentServiceImpl departmentService;

  @Test
  void createDepartment_savesAndReturnsResponse() {
    var request = new CreateDepartmentRequest("HR", "0123456789");

    when(departmentRepo.save(any(Department.class))).thenAnswer(invocation -> {
      var saved = (Department) invocation.getArgument(0);
      setDepartmentId(saved, "dep-1");
      return saved;
    });

    var response = departmentService.createDepartment(request);

    var captor = ArgumentCaptor.forClass(Department.class);
    verify(departmentRepo).save(captor.capture());
    var saved = captor.getValue();
    assertThat(saved.getName()).isEqualTo("HR");
    assertThat(saved.getPhoneNumber()).isEqualTo("0123456789");

    assertThat(response.departmentId()).isEqualTo("dep-1");
    assertThat(response.name()).isEqualTo("HR");
    assertThat(response.phoneNumber()).isEqualTo("0123456789");
  }

  @Test
  void updateDepartment_updatesAndReturnsResponse() {
    var existing = Department.create(builder -> builder
      .name("Ops")
      .phoneNumber("0123456789")
    );
    setDepartmentId(existing, "dep-2");

    when(departmentRepo.findById("dep-2")).thenReturn(Optional.of(existing));
    when(departmentRepo.save(existing)).thenReturn(existing);

    var response = departmentService.updateDepartment(
      "dep-2",
      new UpdateDepartmentRequest("Operations", "0987654321")
    );

    assertThat(response.departmentId()).isEqualTo("dep-2");
    assertThat(response.name()).isEqualTo("Operations");
    assertThat(response.phoneNumber()).isEqualTo("0987654321");
  }

  @Test
  void updateDepartment_missingDepartment_throws() {
    when(departmentRepo.findById("missing")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> departmentService.updateDepartment(
      "missing",
      new UpdateDepartmentRequest("Ops", "0123456789")
    )).isInstanceOf(IllegalArgumentException.class)
      .hasMessage("Department not found");
  }

  @Test
  void getDepartments_returnsPagedResponse() {
    var department = Department.create(builder -> builder
      .name("Finance")
      .phoneNumber("0123456789")
    );
    setDepartmentId(department, "dep-3");

    var pageable = PageRequest.of(0, 2);
    when(departmentRepo.findAll(pageable))
      .thenReturn(new PageImpl<>(List.of(department), pageable, 1));

    var response = departmentService.getDepartments(0, 2);

    assertThat(response.items()).hasSize(1);
    assertThat(response.items().get(0).departmentId()).isEqualTo("dep-3");
    assertThat(response.page()).isEqualTo(0);
    assertThat(response.size()).isEqualTo(2);
    assertThat(response.totalItems()).isEqualTo(1);
    assertThat(response.totalPages()).isEqualTo(1);
  }

  private void setDepartmentId(Department department, String id) {
    try {
      var field = Department.class.getDeclaredField("departmentId");
      field.setAccessible(true);
      field.set(department, id);
    } catch (NoSuchFieldException | IllegalAccessException e) {
      throw new IllegalStateException("Failed to set department id", e);
    }
  }
}
