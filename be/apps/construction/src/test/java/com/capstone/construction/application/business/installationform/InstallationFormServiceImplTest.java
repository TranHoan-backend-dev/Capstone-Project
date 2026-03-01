package com.capstone.construction.application.business.installationform;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstallationFormServiceImplTest {

  @Mock
  private InstallationFormRepository ifRepo;
  @Mock
  private EmployeeService empSrv;

  @InjectMocks
  private InstallationFormServiceImpl service;

  @Test
  void should_ReturnAll_When_NoFilterProvided() {
    // Given
    var pageable = Pageable.unpaged();
    var request = new FilterFormRequest(null, null, null);

    var entity = mock(InstallationForm.class);
    when(entity.getCreatedBy()).thenReturn("user-id");
    when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());
    when(entity.getScheduleSurveyAt()).thenReturn(LocalDate.now());

    when(empSrv.getEmployeeNameById("user-id")).thenReturn(
        new WrapperApiResponse(200, "OK", "Employee Name", LocalDateTime.now()));

    var page = new PageImpl<>(List.of(entity));
    when(ifRepo.findAll(pageable)).thenReturn(page);

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(1);
    verify(ifRepo).findAll(pageable);
    verify(ifRepo, never()).findAll(any(Specification.class), any(Pageable.class));
  }

  @Test
  void should_ReturnFiltered_When_KeywordProvided() {
    // Given
    var pageable = Pageable.unpaged();
    var request = new FilterFormRequest("keyword", null, null);

    var entity = mock(InstallationForm.class);
    when(entity.getCreatedBy()).thenReturn("user-id");
    when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());
    when(entity.getScheduleSurveyAt()).thenReturn(LocalDate.now());

    when(empSrv.getEmployeeNameById("user-id")).thenReturn(
        new WrapperApiResponse(200, "OK", "Employee Name", LocalDateTime.now()));

    var page = new PageImpl<>(List.of(entity));
    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(1);
    verify(ifRepo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void should_ReturnFiltered_When_DatesProvided() {
    // Given
    var pageable = Pageable.unpaged();
    var request = new FilterFormRequest(null, "2023-01-01", "2023-01-31");

    var entity = mock(InstallationForm.class);
    when(entity.getCreatedBy()).thenReturn("user-id");
    when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());
    when(entity.getScheduleSurveyAt()).thenReturn(LocalDate.now());

    when(empSrv.getEmployeeNameById("user-id")).thenReturn(
        new WrapperApiResponse(200, "OK", "Employee Name", LocalDateTime.now()));

    var page = new PageImpl<>(List.of(entity));
    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getTotalElements()).isEqualTo(1);
    verify(ifRepo).findAll(any(Specification.class), eq(pageable));
  }
}
