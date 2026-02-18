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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
  void createDepartment_invalidPhone_throws() {
    var request = new CreateDepartmentRequest("HR", "invalid");

    assertThatThrownBy(() -> departmentService.createDepartment(request))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void createDepartment_emptyName_throws() {
    var request = new CreateDepartmentRequest("", "0123456789");

    assertThatThrownBy(() -> departmentService.createDepartment(request))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void updateDepartment_updatesAndReturnsResponse() {
    var existing = Department.create(builder -> builder
      .name("Ops")
      .phoneNumber("0123456789"));
    setDepartmentId(existing, "dep-2");

    when(departmentRepo.findById("dep-2")).thenReturn(Optional.of(existing));
    when(departmentRepo.save(existing)).thenReturn(existing);

    var response = departmentService.updateDepartment(
      "dep-2",
      new UpdateDepartmentRequest("Operations", "0987654321"));

    assertThat(response.departmentId()).isEqualTo("dep-2");
    assertThat(response.name()).isEqualTo("Operations");
    assertThat(response.phoneNumber()).isEqualTo("0987654321");
  }

  @Test
  void updateDepartment_invalidPhone_throws() {
    var existing = Department.create(builder -> builder.name("Ops").phoneNumber("0123456789"));
    setDepartmentId(existing, "dep-2");
    when(departmentRepo.findById("dep-2")).thenReturn(Optional.of(existing));

    assertThatThrownBy(() -> departmentService.updateDepartment(
      "dep-2",
      new UpdateDepartmentRequest("Operations", "123"))).isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void updateDepartment_missingDepartment_throws() {
    when(departmentRepo.findById("missing")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> departmentService.updateDepartment(
      "missing",
      new UpdateDepartmentRequest("Ops", "0123456789"))).isInstanceOf(IllegalArgumentException.class)
      .hasMessage("Department not found");
  }

  @Test
  void should_GetDepartments_When_KeywordNull() {
    var pageable = PageRequest.of(0, 10);

    Department entity = Department.create(b -> b.name("HR").phoneNumber("0123"));
    Page<Department> page = new PageImpl<>(List.of(entity), pageable, 1);

    when(departmentRepo.findAll(pageable)).thenReturn(page);

    var result = departmentService.getDepartments(pageable, null);

    assertEquals(1, result.items().size());
    assertEquals("HR", result.items().getFirst().name());
    assertEquals(0, result.page());
    assertEquals(10, result.size());
    assertEquals(1, result.totalItems());
    assertEquals(1, result.totalPages());

    verify(departmentRepo).findAll(pageable);
    verifyNoMoreInteractions(departmentRepo);
  }

  // ---------- keyword search ----------

  @Test
  void should_SearchDepartments_When_KeywordProvided() {
    var pageable = PageRequest.of(0, 10);

    var entity = Department.create(b -> b.name("IT").phoneNumber("0999"));
    Page<Department> page = new PageImpl<>(List.of(entity), pageable, 1);

    when(departmentRepo
      .findByDepartmentIdContainsIgnoreCaseOrNameContainsIgnoreCaseOrPhoneNumberContains(
        any(), any(), any(), eq(pageable)))
      .thenReturn(page);

    var result = departmentService.getDepartments(pageable, "it");

    assertEquals(1, result.items().size());
    assertEquals("IT", result.items().getFirst().name());

    verify(departmentRepo)
      .findByDepartmentIdContainsIgnoreCaseOrNameContainsIgnoreCaseOrPhoneNumberContains(
        "it", "it", "it", pageable);
  }

  // ---------- empty result ----------

  @Test
  void should_ReturnEmptyList_When_NoDepartmentFound() {
    var pageable = PageRequest.of(0, 10);
    Page<Department> emptyPage = new PageImpl<>(List.of(), pageable, 0);

    when(departmentRepo.findAll(pageable)).thenReturn(emptyPage);

    var result = departmentService.getDepartments(pageable, null);

    assertTrue(result.items().isEmpty());
    assertEquals(0, result.totalItems());
    assertEquals(0, result.totalPages());
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
