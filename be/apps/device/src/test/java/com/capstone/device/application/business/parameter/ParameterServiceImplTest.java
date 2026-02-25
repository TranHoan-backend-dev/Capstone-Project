package com.capstone.device.application.business.parameter;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.domain.model.Parameters;
import com.capstone.device.infrastructure.persistence.ParameterRepository;
import com.capstone.device.infrastructure.service.EmployeeService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParameterServiceImplTest {

  @Mock
  private ParameterRepository repository;

  @Mock
  private EmployeeService employeeService;

  @InjectMocks
  private ParameterServiceImpl parameterService;

  @Test
  @DisplayName("should_GetParameters_When_FilterIsUUID")
  void should_GetParameters_When_FilterIsUUID() {
    try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
      // Given
      var pageable = Pageable.unpaged();
      var filter = UUID.randomUUID().toString();
      utilsMock.when(() -> Utils.isUUID(filter)).thenReturn(true);

      var parameter = createParameters();
      Page<Parameters> page = new PageImpl<>(List.of(parameter));

      when(repository.findAllByCreatorOrUpdator(eq(filter), eq(filter), eq(pageable))).thenReturn(page);
      when(employeeService.getEmployeeName(anyString()))
        .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", LocalDateTime.now()));

      // When
      Page<ParameterResponse> result = parameterService.getParameters(pageable, filter);

      // Then
      assertNotNull(result);
      assertEquals(1, result.getTotalElements());
      ParameterResponse response = result.getContent().getFirst();
      assertEquals(parameter.getParamId(), response.id());
      assertEquals("Employee Name", response.creatorName());

      verify(repository).findAllByCreatorOrUpdator(filter, filter, pageable);
      verify(employeeService, times(2)).getEmployeeName(anyString());
    }
  }

  @Test
  @DisplayName("should_GetParameters_When_FilterIsName")
  void should_GetParameters_When_FilterIsName() {
    try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
      // Given
      var pageable = Pageable.unpaged();
      var filter = "SomeName";
      // Mock isUUID to false for non-UUID string
      utilsMock.when(() -> Utils.isUUID(filter)).thenReturn(false);

      var parameter = createParameters();
      Page<Parameters> page = new PageImpl<>(List.of(parameter));

      when(repository.findAllByNameContainingIgnoreCase(eq(filter), eq(pageable))).thenReturn(page);
      when(employeeService.getEmployeeName(anyString()))
        .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", LocalDateTime.now()));

      // When
      Page<ParameterResponse> result = parameterService.getParameters(pageable, filter);

      // Then
      assertNotNull(result);
      assertEquals(1, result.getTotalElements());

      verify(repository).findAllByNameContainingIgnoreCase(filter, pageable);
    }
  }

  @Test
  @DisplayName("should_GetParameters_When_FilterIsEmpty")
  void should_GetParameters_When_FilterIsEmpty() {
    // Given
    var pageable = Pageable.unpaged();
    var filter = "";

    var parameter = createParameters();
    Page<Parameters> page = new PageImpl<>(List.of(parameter));

    when(repository.findAll(eq(pageable))).thenReturn(page);
    when(employeeService.getEmployeeName(anyString()))
      .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", LocalDateTime.now()));

    // When
    Page<ParameterResponse> result = parameterService.getParameters(pageable, filter);

    // Then
    assertNotNull(result);
    assertEquals(1, result.getTotalElements());

    verify(repository).findAll(pageable);
    verify(repository, never()).findAllByCreatorOrUpdator(any(), any(), any());
    verify(repository, never()).findAllByNameContainingIgnoreCase(any(), any());
  }

  @Test
  @DisplayName("should_GetParameters_When_FilterIsNull")
  void should_GetParameters_When_FilterIsNull() {
    // Given
    var pageable = Pageable.unpaged();
    String filter = null;

    var parameter = createParameters();
    Page<Parameters> page = new PageImpl<>(List.of(parameter));

    when(repository.findAll(eq(pageable))).thenReturn(page);
    when(employeeService.getEmployeeName(anyString()))
      .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", LocalDateTime.now()));

    // When
    Page<ParameterResponse> result = parameterService.getParameters(pageable, filter);

    // Then
    assertNotNull(result);
    assertEquals(1, result.getTotalElements());

    verify(repository).findAll(pageable);
  }

  @Test
  @DisplayName("should_GetParameters_When_NoDataFound")
  void should_GetParameters_When_NoDataFound() {
    // Given
    var pageable = Pageable.unpaged();
    String filter = null;
    Page<Parameters> page = new PageImpl<>(Collections.<Parameters>emptyList());

    when(repository.findAll(eq(pageable))).thenReturn(page);

    // When
    Page<ParameterResponse> result = parameterService.getParameters(pageable, filter);

    // Then
    assertNotNull(result);
    assertTrue(result.isEmpty());

    verify(repository).findAll(pageable);
    verify(employeeService, never()).getEmployeeName(anyString());
  }

  private @NonNull Parameters createParameters() {
    // Assuming @AllArgsConstructor is available due to Lombok annotation on the
    // class.
    // Field order: paramId, name, value, creator, updator, createdAt, updatedAt
    return new Parameters(
      UUID.randomUUID().toString(),
      "Test Param",
      BigDecimal.valueOf(100.0),
      UUID.randomUUID().toString(),
      UUID.randomUUID().toString(),
      LocalDateTime.now(),
      LocalDateTime.now());
  }
}
