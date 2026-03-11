package com.capstone.organization.service.impl;

import com.capstone.common.exception.ExistingException;
import com.capstone.organization.dto.request.department.CreateDepartmentRequest;
import com.capstone.organization.dto.request.department.UpdateDepartmentRequest;
import com.capstone.organization.model.Department;
import com.capstone.organization.repository.DepartmentRepository;
import com.capstone.organization.utils.Constant;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DepartmentServiceImpl Unit Tests")
class DepartmentServiceImplTest {

  @Mock
  DepartmentRepository departmentRepo;

  @InjectMocks
  DepartmentServiceImpl departmentService;

  @Nested
  @DisplayName("Create Department Tests")
  class CreateDepartmentTests {

    @Test
    @DisplayName("Should create department when request is valid")
    void should_CreateDepartment_When_RequestIsValid() {
      // Given
      var request = new CreateDepartmentRequest("Engineering", "0123456789");
      when(departmentRepo.existsByPhoneNumber(request.phoneNumber())).thenReturn(false);
      when(departmentRepo.existsByNameIgnoreCase(request.name())).thenReturn(false);
      when(departmentRepo.save(any(Department.class))).thenAnswer(invocation -> {
        Department department = invocation.getArgument(0);
        ReflectionTestUtils.setField(department, "departmentId", "dep-123");
        return department;
      });

      // When
      var response = departmentService.createDepartment(request);

      // Then
      assertThat(response).isNotNull();
      assertThat(response.departmentId()).isEqualTo("dep-123");
      assertThat(response.name()).isEqualTo("Engineering");
      assertThat(response.phoneNumber()).isEqualTo("0123456789");

      verify(departmentRepo).existsByPhoneNumber(request.phoneNumber());
      verify(departmentRepo).existsByNameIgnoreCase(request.name());
      verify(departmentRepo).save(any(Department.class));
    }

    @Test
    @DisplayName("Should throw ExistingException when phone number already exists")
    void should_ThrowExistingException_When_PhoneNumberExists() {
      // Given
      var request = new CreateDepartmentRequest("Engineering", "0123456789");
      when(departmentRepo.existsByPhoneNumber(request.phoneNumber())).thenReturn(true);

      // When & Then
      assertThatThrownBy(() -> departmentService.createDepartment(request)).isInstanceOf(ExistingException.class)
          .hasMessage("Phone number already exists");

      verify(departmentRepo).existsByPhoneNumber(request.phoneNumber());
      verify(departmentRepo, never()).existsByNameIgnoreCase(anyString());
      verify(departmentRepo, never()).save(any(Department.class));
    }

    @Test
    @DisplayName("Should throw ExistingException when name already exists")
    void should_ThrowExistingException_When_NameExists() {
      // Given
      var request = new CreateDepartmentRequest("Engineering", "0123456789");
      when(departmentRepo.existsByPhoneNumber(request.phoneNumber())).thenReturn(false);
      when(departmentRepo.existsByNameIgnoreCase(request.name())).thenReturn(true);

      // When & Then
      assertThatThrownBy(() -> departmentService.createDepartment(request)).isInstanceOf(ExistingException.class)
          .hasMessage("Name already exists");

      verify(departmentRepo).existsByPhoneNumber(request.phoneNumber());
      verify(departmentRepo).existsByNameIgnoreCase(request.name());
      verify(departmentRepo, never()).save(any(Department.class));
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when phone number is invalid")
    void should_ThrowIllegalArgumentException_When_PhoneNumberInvalid() {
      // Given
      var request = new CreateDepartmentRequest("Engineering", "invalid-phone");
      when(departmentRepo.existsByPhoneNumber(anyString())).thenReturn(false);
      when(departmentRepo.existsByNameIgnoreCase(anyString())).thenReturn(false);

      // When & Then
      assertThatThrownBy(() -> departmentService.createDepartment(request)).isInstanceOf(IllegalArgumentException.class)
          .hasMessage(Constant.ORG_10); // "Phone number must be 10 digits"
    }

    @Test
    @DisplayName("Should throw NullPointerException when request is null")
    void should_ThrowNullPointerException_When_CreateRequestIsNull() {
      assertThatThrownBy(() -> departmentService.createDepartment(null))
          .isInstanceOf(NullPointerException.class);
    }
  }

  @Nested
  @DisplayName("Update Department Tests")
  class UpdateDepartmentTests {

    @Test
    @DisplayName("Should update department when request is valid")
    void should_UpdateDepartment_When_RequestIsValid() {
      // Given
      var departmentId = "dep-123";
      var request = new UpdateDepartmentRequest("New Tech", "0987654321");

      var existingDepartment = Department.create(b -> b.name("Old Tech").phoneNumber("0123456789"));
      ReflectionTestUtils.setField(existingDepartment, "departmentId", departmentId);

      when(departmentRepo.findById(departmentId)).thenReturn(Optional.of(existingDepartment));
      when(departmentRepo.existsByPhoneNumber(request.phoneNumber())).thenReturn(false);
      when(departmentRepo.existsByNameIgnoreCase(request.name())).thenReturn(false);
      when(departmentRepo.save(any(Department.class))).thenReturn(existingDepartment);

      // When
      var response = departmentService.updateDepartment(departmentId, request);

      // Then
      assertThat(response.name()).isEqualTo("New Tech");
      assertThat(response.phoneNumber()).isEqualTo("0987654321");
      verify(departmentRepo).save(existingDepartment);
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when department not found")
    void should_ThrowIllegalArgumentException_When_DepartmentNotFound() {
      // Given
      var departmentId = "unknown";
      var request = new UpdateDepartmentRequest("New", "0987654321");
      when(departmentRepo.findById(departmentId)).thenReturn(Optional.empty());

      // When & Then
      assertThatThrownBy(() -> departmentService.updateDepartment(departmentId, request))
          .isInstanceOf(IllegalArgumentException.class).hasMessage("Department not found");
    }

    @Test
    @DisplayName("Should throw ExistingException when updating to existing phone number")
    void should_ThrowExistingException_When_UpdatingPhoneNumberToExistingOne() {
      // Given
      var departmentId = "dep-123";
      var request = new UpdateDepartmentRequest("New Name", "0999999999");

      var existingDepartment = Department.create(b -> b.name("Old Name").phoneNumber("0123456789"));
      ReflectionTestUtils.setField(existingDepartment, "departmentId", departmentId);

      when(departmentRepo.findById(departmentId)).thenReturn(Optional.of(existingDepartment));
      when(departmentRepo.existsByPhoneNumber(request.phoneNumber())).thenReturn(true);

      // When & Then
      assertThatThrownBy(() -> departmentService.updateDepartment(departmentId, request))
          .isInstanceOf(ExistingException.class).hasMessage("Phone number already exists");
    }

    @Test
    @DisplayName("Should throw ExistingException when updating to existing name")
    void should_ThrowExistingException_When_UpdatingNameToExistingOne() {
      // Given
      var departmentId = "dep-123";
      var request = new UpdateDepartmentRequest("Existing Name", "0123456789");

      var existingDepartment = Department.create(b -> b.name("Old Name").phoneNumber("0123456789"));
      ReflectionTestUtils.setField(existingDepartment, "departmentId", departmentId);

      when(departmentRepo.findById(departmentId)).thenReturn(Optional.of(existingDepartment));
      when(departmentRepo.existsByPhoneNumber(request.phoneNumber())).thenReturn(false); // Same phone, no check needed
      // but existsByPhoneNumber
      // returns false anyway
      when(departmentRepo.existsByNameIgnoreCase(request.name())).thenReturn(true);

      // When & Then
      assertThatThrownBy(() -> departmentService.updateDepartment(departmentId, request))
          .isInstanceOf(ExistingException.class).hasMessage("Name already exists");
    }

    @Test
    @DisplayName("Should not update fields when request fields are null or blank")
    void should_NotUpdateFields_When_RequestFieldsAreNullOrBlank() {
      // Given
      var departmentId = "dep-123";
      var request = new UpdateDepartmentRequest("", null);

      var existingDepartment = Department.create(b -> b.name("Keep Me").phoneNumber("0123456789"));
      ReflectionTestUtils.setField(existingDepartment, "departmentId", departmentId);

      when(departmentRepo.findById(departmentId)).thenReturn(Optional.of(existingDepartment));
      when(departmentRepo.save(any(Department.class))).thenReturn(existingDepartment);

      // When
      var response = departmentService.updateDepartment(departmentId, request);

      // Then
      assertThat(response.name()).isEqualTo("Keep Me");
      assertThat(response.phoneNumber()).isEqualTo("0123456789");
    }

    @Test
    @DisplayName("Should throw NullPointerException when request is null")
    void should_ThrowNullPointerException_When_UpdateRequestIsNull() {
      assertThatThrownBy(() -> departmentService.updateDepartment("id", null))
          .isInstanceOf(NullPointerException.class);
    }
  }

  @Nested
  @DisplayName("Get Departments Tests")
  class GetDepartmentsTests {

    @Test
    @DisplayName("Should get departments when keyword is null")
    void should_GetDepartments_When_KeywordIsNull() {
      // Given
      var pageable = PageRequest.of(0, 10);
      var dept = Department.create(b -> b.name("HR").phoneNumber("0123456789"));
      Page<Department> page = new PageImpl<>(List.of(dept));

      when(departmentRepo.findAll(pageable)).thenReturn(page);

      // When
      var response = departmentService.getDepartments(pageable, null);

      // Then
      assertThat(response.items()).hasSize(1);
      assertThat(response.items().getFirst().name()).isEqualTo("HR");
      verify(departmentRepo).findAll(pageable);
    }

    @Test
    @DisplayName("Should get departments when keyword is provided")
    void should_GetDepartments_When_KeywordIsProvided() {
      // Given
      var pageable = PageRequest.of(0, 10);
      var keyword = "tech";
      var dept = Department.create(b -> b.name("Tech").phoneNumber("0123456789"));
      Page<Department> page = new PageImpl<>(List.of(dept));

      when(departmentRepo.findByDepartmentIdContainsIgnoreCaseOrNameContainsIgnoreCaseOrPhoneNumberContains(keyword,
          keyword, keyword, pageable)).thenReturn(page);

      // When
      var response = departmentService.getDepartments(pageable, keyword);

      // Then
      assertThat(response.items()).hasSize(1);
      assertThat(response.items().getFirst().name()).isEqualTo("Tech");
      verify(departmentRepo).findByDepartmentIdContainsIgnoreCaseOrNameContainsIgnoreCaseOrPhoneNumberContains(keyword,
          keyword, keyword, pageable);
    }
  }

  @Nested
  @DisplayName("Check Existence Tests")
  class ExistenceTests {
    @Test
    @DisplayName("Should return true when department exists")
    void should_ReturnTrue_When_DepartmentExists() {
      when(departmentRepo.existsById("dep-123")).thenReturn(true);
      assertThat(departmentService.checkIfDepartmentExists("dep-123")).isTrue();
    }

    @Test
    @DisplayName("Should return false when department does not exist")
    void should_ReturnFalse_When_DepartmentDoesNotExist() {
      when(departmentRepo.existsById("unknown")).thenReturn(false);
      assertThat(departmentService.checkIfDepartmentExists("unknown")).isFalse();
    }
  }

  @Nested
  @DisplayName("Delete Department Tests")
  class DeleteDepartmentTests {

    @Test
    @DisplayName("Should delete department when id exists")
    void should_DeleteDepartment_When_IdExists() {
      // Given
      var departmentId = "dep-123";
      when(departmentRepo.existsById(departmentId)).thenReturn(true);

      // When
      departmentService.deleteDepartment(departmentId);

      // Then
      verify(departmentRepo).deleteById(departmentId);
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when id does not exist")
    void should_ThrowIllegalArgumentException_When_IdDoesNotExist() {
      // Given
      var departmentId = "unknown";
      when(departmentRepo.existsById(departmentId)).thenReturn(false);

      // When & Then
      assertThatThrownBy(() -> departmentService.deleteDepartment(departmentId))
          .isInstanceOf(IllegalArgumentException.class).hasMessage("Department not found");

      verify(departmentRepo, never()).deleteById(anyString());
    }
  }
}
