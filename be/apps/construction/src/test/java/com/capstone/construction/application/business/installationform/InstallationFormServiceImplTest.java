package com.capstone.construction.application.business.installationform;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.infrastructure.config.Constant;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstallationFormServiceImplTest {

  @Mock
  private InstallationFormRepository ifRepo;
  @Mock
  private WaterSupplyNetworkRepository wsnRepo;
  @Mock
  private EmployeeService empSrv;

  @InjectMocks
  private InstallationFormServiceImpl service;

  @Test
  void should_CreateForm_Success() {
    // Given
    var request = mock(NewOrderRequest.class);
    when(request.formNumber()).thenReturn("F001");
    when(request.formCode()).thenReturn("C001");
    when(request.createdBy()).thenReturn("user1");
    when(request.networkId()).thenReturn("net1");
    when(request.customerType()).thenReturn("INDIVIDUAL");
    when(request.receivedFormAt()).thenReturn("2023-01-01");
    when(request.scheduleSurveyAt()).thenReturn("2023-01-05");

    when(empSrv.isEmployeeExisting("user1")).thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(wsnRepo.findById("net1")).thenReturn(Optional.of(mock(WaterSupplyNetwork.class)));

    var savedEntity = mock(InstallationForm.class);
    when(savedEntity.getFormCode()).thenReturn("C001");
    when(savedEntity.getCustomerName()).thenReturn("Name");
    when(savedEntity.getCreatedAt()).thenReturn(LocalDateTime.now());
    when(ifRepo.save(any())).thenReturn(savedEntity);

    // When
    var response = service.createNewInstallationForm(request);

    // Then
    assertThat(response).isNotNull();
    verify(ifRepo).save(any());
  }

  @Test
  void should_ThrowException_When_AuthorNotFound() {
    // Given
    var request = mock(NewOrderRequest.class);
    when(request.createdBy()).thenReturn("unknown");
    when(empSrv.isEmployeeExisting("unknown"))
        .thenReturn(new WrapperApiResponse(200, "OK", false, LocalDateTime.now()));

    // When & Then
    assertThatThrownBy(() -> service.createNewInstallationForm(request))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage(Constant.PT_61);
  }

  @Test
  void should_ThrowException_When_NetworkNotFound() {
    // Given
    var request = mock(NewOrderRequest.class);
    when(request.createdBy()).thenReturn("user1");
    when(request.networkId()).thenReturn("unknown-net");
    when(empSrv.isEmployeeExisting("user1")).thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(wsnRepo.findById("unknown-net")).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> service.createNewInstallationForm(request))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessage(Constant.PT_59);
  }

  @Test
  void should_ReturnAll_When_NoFilterProvided() {
    // Given
    var pageable = Pageable.unpaged();
    var request = new FilterFormRequest(null, null, null);

    var entity = mock(InstallationForm.class);
    when(entity.getCreatedBy()).thenReturn("user-id");
    when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());

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
  }

  @Test
  void should_ReturnFiltered_When_KeywordProvided() {
    // Given
    var pageable = Pageable.unpaged();
    var request = new FilterFormRequest("keyword", null, null);

    var entity = mock(InstallationForm.class);
    when(entity.getCreatedBy()).thenReturn("user-id");
    when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());

    when(empSrv.getEmployeeNameById("user-id")).thenReturn(
        new WrapperApiResponse(200, "OK", "Employee Name", LocalDateTime.now()));

    var page = new PageImpl<>(List.of(entity));
    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result).isNotNull();
    verify(ifRepo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void should_ReturnTrue_When_FormExists() {
    // Given
    when(ifRepo.existsByFormNumberAndFormCode("N1", "C1")).thenReturn(true);

    // When
    var result = service.isInstallationFormExisting("N1", "C1");

    // Then
    assertThat(result).isTrue();
  }
}
