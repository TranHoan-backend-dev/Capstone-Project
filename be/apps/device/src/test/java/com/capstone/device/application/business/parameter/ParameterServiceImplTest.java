package com.capstone.device.application.business.parameter;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.domain.model.Parameters;
import com.capstone.device.infrastructure.persistence.ParameterRepository;
import com.capstone.device.infrastructure.service.EmployeeService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
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
  void should_GetParameters_When_FilterIsUUID() {
    try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
      // Given
      var pageable = Pageable.unpaged();
      var filter = UUID.randomUUID().toString();
      utilsMock.when(() -> Utils.isUUID(filter)).thenReturn(true);

      var parameter = createParameters();
      var page = new PageImpl<>(List.of(parameter));

      when(repository.findAllByCreatorOrUpdator(eq(filter), eq(filter), eq(pageable))).thenReturn(page);
      when(employeeService.getEmployeeName(anyString()))
          .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", LocalDateTime.now()));

      // When
      var result = parameterService.getParameters(pageable, filter);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.getTotalElements()).isEqualTo(1);

      var response = result.getContent().getFirst();
      assertThat(response.id()).isEqualTo(parameter.getParamId());
      assertThat(response.creatorName()).isEqualTo("Employee Name");

      verify(repository).findAllByCreatorOrUpdator(filter, filter, pageable);
      verify(employeeService, times(2)).getEmployeeName(anyString());
    }
  }

  @Test
  void should_GetParameters_When_FilterIsName() {
    try (MockedStatic<Utils> utilsMock = mockStatic(Utils.class)) {
      // Given
      var pageable = Pageable.unpaged();
      var filter = "SomeName";
      utilsMock.when(() -> Utils.isUUID(filter)).thenReturn(false);

      var parameter = createParameters();
      var page = new PageImpl<>(List.of(parameter));

      when(repository.findAllByNameContainingIgnoreCase(eq(filter), eq(pageable))).thenReturn(page);
      when(employeeService.getEmployeeName(anyString()))
          .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", LocalDateTime.now()));

      // When
      var result = parameterService.getParameters(pageable, filter);

      // Then
      assertThat(result).isNotNull();
      assertThat(result.getTotalElements()).isEqualTo(1);

      verify(repository).findAllByNameContainingIgnoreCase(filter, pageable);
    }
  }

  @Test
  void should_GetParameters_When_FilterIsEmpty() {
    // Given
    var pageable = Pageable.unpaged();
    var filter = "";

    var parameter = createParameters();
    var page = new PageImpl<>(List.of(parameter));

    when(repository.findAll(eq(pageable))).thenReturn(page);
    when(employeeService.getEmployeeName(anyString()))
        .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", LocalDateTime.now()));

    // When
    var result = parameterService.getParameters(pageable, filter);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(1);

    verify(repository).findAll(pageable);
    verify(repository, never()).findAllByCreatorOrUpdator(any(), any(), any());
    verify(repository, never()).findAllByNameContainingIgnoreCase(any(), any());
  }

  @Test
  void should_GetParameters_When_FilterIsNull() {
    // Given
    var pageable = Pageable.unpaged();
    String filter = null;

    var parameter = createParameters();
    var page = new PageImpl<>(List.of(parameter));

    when(repository.findAll(eq(pageable))).thenReturn(page);
    when(employeeService.getEmployeeName(anyString()))
        .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", LocalDateTime.now()));

    // When
    var result = parameterService.getParameters(pageable, filter);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(1);

    verify(repository).findAll(pageable);
  }

  @Test
  void should_GetParameters_When_NoDataFound() {
    // Given
    var pageable = Pageable.unpaged();
    String filter = null;
    var page = new PageImpl<Parameters>(Collections.emptyList());

    when(repository.findAll(eq(pageable))).thenReturn(page);

    // When
    var result = parameterService.getParameters(pageable, filter);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.isEmpty()).isTrue();

    verify(repository).findAll(pageable);
    verify(employeeService, never()).getEmployeeName(anyString());
  }

  private @NonNull Parameters createParameters() {
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
