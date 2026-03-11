package com.capstone.device.application.business.parameter;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.device.application.dto.request.UpdateParameterRequest;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.domain.model.Parameters;
import com.capstone.device.infrastructure.persistence.ParameterRepository;
import com.capstone.device.infrastructure.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParameterServiceImplTest {

  @Mock
  ParameterRepository repository;

  @Mock
  EmployeeService employeeService;

  @Mock
  Logger log;

  @InjectMocks
  ParameterServiceImpl parameterService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(parameterService, "log", log);
  }

  @Test
  void should_ReturnPaginatedParameters_When_NoFilter() {
    Pageable pageable = mock(Pageable.class);
    Parameters param = createMockParam("1", "VAT", new BigDecimal("0.1"));
    Page<Parameters> page = new PageImpl<>(Collections.singletonList(param));

    when(repository.findAll(pageable)).thenReturn(page);
    when(employeeService.getEmployeeName(any())).thenReturn(new WrapperApiResponse<>(200, "Admin", true));

    Page<ParameterResponse> result = parameterService.getParameters(pageable, null);

    assertEquals(1, result.getTotalElements());
    verify(repository).findAll(pageable);
  }

  @Test
  void should_ReturnPaginatedParameters_When_NameFilter() {
    Pageable pageable = mock(Pageable.class);
    String filter = "VAT";
    Parameters param = createMockParam("1", "VAT", new BigDecimal("0.1"));
    Page<Parameters> page = new PageImpl<>(Collections.singletonList(param));

    when(repository.findAllByNameContainingIgnoreCase(filter, pageable)).thenReturn(page);
    when(employeeService.getEmployeeName(any())).thenReturn(new WrapperApiResponse<>(200, "Admin", true));

    Page<ParameterResponse> result = parameterService.getParameters(pageable, filter);

    assertEquals(1, result.getTotalElements());
    verify(repository).findAllByNameContainingIgnoreCase(filter, pageable);
  }

  @Test
  void should_UpdateParameter_When_ValidRequest() {
    String id = "1";
    UpdateParameterRequest request = new UpdateParameterRequest("New Name", new BigDecimal("0.08"));
    Parameters existingParam = createMockParam(id, "Old Name", new BigDecimal("0.1"));

    // Mock Security Context
    JwtAuthenticationToken auth = mock(JwtAuthenticationToken.class);
    when(auth.getName()).thenReturn("Current User");
    SecurityContext securityContext = mock(SecurityContext.class);
    when(securityContext.getAuthentication()).thenReturn(auth);
    SecurityContextHolder.setContext(securityContext);

    when(repository.findById(id)).thenReturn(Optional.of(existingParam));
    when(repository.save(any(Parameters.class))).thenReturn(existingParam);
    when(employeeService.getEmployeeName(any())).thenReturn(new WrapperApiResponse<>(200, "Admin", true));

    ParameterResponse result = parameterService.updateParameter(id, request);

    assertEquals("New Name", result.name());
    assertEquals("0.08", result.value());
    verify(repository).save(existingParam);

    SecurityContextHolder.clearContext();
  }

  @Test
  void should_ThrowException_When_UpdateParameterNotFound() {
    String id = "not-found";
    UpdateParameterRequest request = new UpdateParameterRequest("VAT", new BigDecimal("0.08"));
    when(repository.findById(id)).thenReturn(Optional.empty());

    assertThrows(IllegalArgumentException.class, () -> parameterService.updateParameter(id, request));
  }

  @Test
  void should_GetParameterById_When_Found() {
    String id = "1";
    Parameters param = createMockParam(id, "VAT", new BigDecimal("0.1"));
    when(repository.findById(id)).thenReturn(Optional.of(param));
    when(employeeService.getEmployeeName(any())).thenReturn(new WrapperApiResponse<>(200, "Admin", true));

    ParameterResponse result = parameterService.getParameterById(id);

    assertEquals("VAT", result.name());
  }

  private Parameters createMockParam(String id, String name, BigDecimal value) {
    Parameters param = new Parameters();
    ReflectionTestUtils.setField(param, "paramId", id);
    ReflectionTestUtils.setField(param, "name", name);
    ReflectionTestUtils.setField(param, "value", value);
    ReflectionTestUtils.setField(param, "creator", "admin-uuid");
    ReflectionTestUtils.setField(param, "updator", "admin-uuid");
    ReflectionTestUtils.setField(param, "createdAt", LocalDateTime.now());
    ReflectionTestUtils.setField(param, "updatedAt", LocalDateTime.now());
    return param;
  }
}
