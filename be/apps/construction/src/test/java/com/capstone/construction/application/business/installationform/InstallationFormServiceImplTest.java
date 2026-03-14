package com.capstone.construction.application.business.installationform;

import com.capstone.common.enumerate.CustomerType;
import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.domain.model.utils.FormProcessingStatus;
import com.capstone.construction.infrastructure.utils.Message;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.service.OverallWaterMeterService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
  @Mock
  private OverallWaterMeterService owmSrv;

  @InjectMocks
  private InstallationFormServiceImpl service;

  @Test
  void should_CreateNewInstallationForm_When_ValidRequest() {
    // Given
    var request = createValidNewOrderRequest();
    var network = mock(WaterSupplyNetwork.class);
    var savedEntity = createSavedInstallationForm(request);

    when(empSrv.isEmployeeExisting(request.createdBy()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(owmSrv.isMeterExisting(request.overallWaterMeterId()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(wsnRepo.findById(request.networkId())).thenReturn(Optional.of(network));
    when(ifRepo.save(any(InstallationForm.class))).thenReturn(savedEntity);

    // When
    var response = service.createNewInstallationForm(request);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.formNumber()).isEqualTo(request.formNumber());
    verify(ifRepo).save(any(InstallationForm.class));
  }

  @Test
  void should_CreateNewInstallationForm_When_NoRepresentative() {
    // Given
    var request = new NewOrderRequest(
      "CODE", "NUM", "Name", "Address", "123456789012", "2020-01-01", "Loc", "0901234567",
      "TAX01", "BANK01", "LOC", UsageTarget.INSTITUTIONAL, CustomerType.FAMILY,
      "2024-01-01", "2024-01-05", 1, 1, null, "net1", "emp1", "meter1");
    var network = mock(WaterSupplyNetwork.class);
    var savedEntity = createSavedInstallationForm(request);

    when(empSrv.isEmployeeExisting(request.createdBy()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(owmSrv.isMeterExisting(request.overallWaterMeterId()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(wsnRepo.findById(request.networkId())).thenReturn(Optional.of(network));
    when(ifRepo.save(any(InstallationForm.class))).thenReturn(savedEntity);

    // When
    var response = service.createNewInstallationForm(request);

    // Then
    assertThat(response).isNotNull();
    verify(ifRepo).save(any(InstallationForm.class));
  }

  @Test
  void should_ThrowException_When_AuthorDoesNotExist() {
    // Given
    var request = createValidNewOrderRequest();
    when(empSrv.isEmployeeExisting(request.createdBy()))
      .thenReturn(new WrapperApiResponse(200, "OK", false, LocalDateTime.now()));

    // When & Then
    assertThatThrownBy(() -> service.createNewInstallationForm(request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.PT_36);
  }

  @Test
  void should_ThrowException_When_MeterDoesNotExist() {
    // Given
    var request = createValidNewOrderRequest();
    when(empSrv.isEmployeeExisting(request.createdBy()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(owmSrv.isMeterExisting(request.overallWaterMeterId()))
      .thenReturn(new WrapperApiResponse(200, "OK", false, LocalDateTime.now()));

    // When & Then
    assertThatThrownBy(() -> service.createNewInstallationForm(request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.SE_06);
  }

  @Test
  void should_ThrowException_When_NetworkDoesNotExist() {
    // Given
    var request = createValidNewOrderRequest();
    when(empSrv.isEmployeeExisting(request.createdBy()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(owmSrv.isMeterExisting(request.overallWaterMeterId()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));
    when(wsnRepo.findById(request.networkId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> service.createNewInstallationForm(request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.PT_34);
  }

  @Test
  void should_ThrowException_When_CreateRequestIsNull() {
    assertThatThrownBy(() -> service.createNewInstallationForm(null))
      .isInstanceOf(NullPointerException.class);
  }

  @Test
  void should_GetInstallationForms_When_NoFilters() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();

    when(ifRepo.findAll(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(pageable);
  }

  @Test
  void should_GetInstallationForms_When_KeywordProvided() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest("test", null, null);
    var entity = createMockEntity();

    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void should_GetInstallationForms_When_DateRangeProvided() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, "2024-01-01", "2024-01-31");
    var entity = createMockEntity();

    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void should_GetInstallationForms_When_KeywordIsBlank() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest("   ", null, null);
    var entity = createMockEntity();

    when(ifRepo.findAll(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(pageable);
  }

  @Test
  void should_GetInstallationForms_When_OnlyFromDateProvided() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, "2024-01-01", null);
    var entity = createMockEntity();

    when(ifRepo.findAll(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(pageable);
  }

  @Test
  void should_MapToResponse_When_EmployeeDataIsNull() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();

    when(ifRepo.findAll(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", null, LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent().getFirst().handoverBy()).isEqualTo("Unknown");
  }

  @Test
  void should_MapToResponse_When_EmployeeNameNotFound() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();

    when(ifRepo.findAll(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(null);

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent().getFirst().handoverBy()).isEqualTo("Unknown");
  }

  @Test
  void should_MapToResponse_When_ScheduleSurveyAtIsNull() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();
    when(entity.getScheduleSurveyAt()).thenReturn(null);

    when(ifRepo.findAll(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", "Staff", LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent().getFirst().scheduleSurveyAt()).isNull();
  }

  @Test
  void should_ReturnTrue_When_FormExistsByNumberOrCode() {
    // When
    when(ifRepo.existsById_FormNumberOrId_FormCode("NUM", "CODE")).thenReturn(true);
    var result = service.isInstallationFormExisting("NUM", "CODE");

    // Then
    assertThat(result).isTrue();
  }

  @Test
  void should_ReturnFalse_When_FormDoesNotExist() {
    // When
    when(ifRepo.existsById_FormNumberOrId_FormCode("NUM", "CODE")).thenReturn(false);
    var result = service.isInstallationFormExisting("NUM", "CODE");

    // Then
    assertThat(result).isFalse();
  }

  @Test
  void should_ThrowException_When_FilterRequestIsNull() {
    assertThatThrownBy(() -> service.getInstallationForms(PageRequest.of(0, 10), null))
      .isInstanceOf(NullPointerException.class);
  }

  @Test
  void should_GetInstallationForms_When_KeywordProvided_But_DatesNull() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest("keyword", null, null);
    var entity = createMockEntity();

    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void should_GetInstallationForms_When_OnlyToDateProvided() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, "2024-01-31");
    var entity = createMockEntity();

    when(ifRepo.findAll(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(pageable);
  }

  @Test
  void should_GetConstructionRequestsList_When_ValidRequest() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest("keyword", "2024-01-01", "2024-01-31");
    var entity = createMockEntity();

    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", "Staff", LocalDateTime.now()));

    // When
    var result = service.getConstructionRequestsList(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void should_GetConstructionRequestsList_When_NoFilters() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();

    when(ifRepo.findByStatus_ContractAndStatus_Construction(ProcessingStatus.APPROVED, ProcessingStatus.PROCESSING,
      pageable))
      .thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", "Staff", LocalDateTime.now()));

    // When
    var result = service.getConstructionRequestsList(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findByStatus_ContractAndStatus_Construction(ProcessingStatus.APPROVED, ProcessingStatus.PROCESSING,
      pageable);
  }

  @Test
  void should_ApproveAndAssign_When_StatusIsTrue() {
    // Given
    var request = new ApproveRequest("EMP-001", "F-001", "C-001", true);
    var entity = createMockEntity();
    var status = new FormProcessingStatus(ProcessingStatus.PENDING_FOR_APPROVAL, ProcessingStatus.PROCESSING,
      ProcessingStatus.PROCESSING, ProcessingStatus.PROCESSING);
    when(entity.getStatus()).thenReturn(status);

    when(ifRepo.findById_FormCodeAndId_FormNumber("C-001", "F-001")).thenReturn(Optional.of(entity));
    when(empSrv.isEmployeeExisting("EMP-001"))
      .thenReturn(new WrapperApiResponse(200, "OK", "true", LocalDateTime.now()));

    // When
    service.approveAndAssignInstallationForm(request);

    // Then
    assertThat(status.getRegistration()).isEqualTo(ProcessingStatus.APPROVED);
    verify(entity).setHandoverBy("EMP-001");
    verify(ifRepo).save(entity);
  }

  @Test
  void should_Reject_When_StatusIsFalse() {
    // Given
    var request = new ApproveRequest("EMP-001", "F-001", "C-001", false);
    var entity = createMockEntity();
    var status = new FormProcessingStatus(ProcessingStatus.PENDING_FOR_APPROVAL, ProcessingStatus.PROCESSING,
      ProcessingStatus.PROCESSING, ProcessingStatus.PROCESSING);
    when(entity.getStatus()).thenReturn(status);

    when(ifRepo.findById_FormCodeAndId_FormNumber("C-001", "F-001")).thenReturn(Optional.of(entity));

    // When
    service.approveAndAssignInstallationForm(request);

    // Then
    assertThat(status.getRegistration()).isEqualTo(ProcessingStatus.REJECTED);
    verify(ifRepo).save(entity);
  }

  @Test
  void should_ThrowException_When_FormNotFoundInApprove() {
    // Given
    var request = new ApproveRequest("EMP-001", "F-001", "C-001", true);
    when(ifRepo.findById_FormCodeAndId_FormNumber("C-001", "F-001")).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> service.approveAndAssignInstallationForm(request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.PT_36);
  }

  @Test
  void should_ThrowException_When_EmployeeNotFoundInApprove() {
    // Given
    var request = new ApproveRequest("EMP-001", "F-001", "C-001", true);
    var entity = createMockEntity();
    when(entity.getStatus()).thenReturn(new FormProcessingStatus(ProcessingStatus.PENDING_FOR_APPROVAL,
      ProcessingStatus.PROCESSING, ProcessingStatus.PROCESSING, ProcessingStatus.PROCESSING));

    when(ifRepo.findById_FormCodeAndId_FormNumber("C-001", "F-001")).thenReturn(Optional.of(entity));
    when(empSrv.isEmployeeExisting("EMP-001"))
      .thenReturn(new WrapperApiResponse(200, "OK", "false", LocalDateTime.now()));

    // When & Then
    assertThatThrownBy(() -> service.approveAndAssignInstallationForm(request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.PT_35);
  }

  @Test
  void should_GetByFormCodeAndNumber_When_Exists() {
    // Given
    var entity = createMockEntity();
    when(ifRepo.findById_FormCodeAndId_FormNumber("C-001", "F-001")).thenReturn(Optional.of(entity));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", "Staff", LocalDateTime.now()));

    // When
    var result = service.getByFormCodeAndFormNumber("C-001", "F-001");

    // Then
    assertThat(result).isNotNull();
    assertThat(result.formCode()).isEqualTo("FC01");
  }

  @Test
  void should_ThrowException_When_NotFoundInGetByCodeAndNumber() {
    // When & Then
    when(ifRepo.findById_FormCodeAndId_FormNumber("C-001", "F-001")).thenReturn(Optional.empty());
    assertThatThrownBy(() -> service.getByFormCodeAndFormNumber("C-001", "F-001"))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.PT_36);
  }

  // Helper methods
  private @NonNull NewOrderRequest createValidNewOrderRequest() {
    return new NewOrderRequest(
      "F-001", "NUM-001", "Customer Name", "123 Address", "123456789012", "2000-01-01", "Hanoi",
      "0912345678", "TAX-001", "BANK-001", "Hanoi", UsageTarget.COMMERCIAL, CustomerType.COMPANY,
      "2024-01-01", "2024-01-05", 4, 1, new ArrayList<>(), "NET-001", "EMP-001", "METER-001");
  }

  private @NonNull InstallationForm createSavedInstallationForm(@NonNull NewOrderRequest request) {
    var form = mock(InstallationForm.class);
    when(form.getFormNumber()).thenReturn(request.formNumber());
    when(form.getCustomerName()).thenReturn(request.customerName());
    when(form.getFormCode()).thenReturn(request.formCode());
    when(form.getCreatedBy()).thenReturn(request.createdBy());
    when(form.getCreatedAt()).thenReturn(LocalDateTime.now());
    return form;
  }

  private InstallationForm createMockEntity() {
    var entity = mock(InstallationForm.class);
    when(entity.getFormCode()).thenReturn("FC01");
    when(entity.getFormNumber()).thenReturn("FN01");
    when(entity.getCustomerName()).thenReturn("Customer");
    when(entity.getAddress()).thenReturn("Address");
    when(entity.getPhoneNumber()).thenReturn("0912345678");
    when(entity.getScheduleSurveyAt()).thenReturn(LocalDate.now());
    when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());
    when(entity.getCreatedBy()).thenReturn("EMP01");
    var status = new FormProcessingStatus();
    status.setRegistration(ProcessingStatus.PROCESSING);
    when(entity.getStatus()).thenReturn(status);
    return entity;
  }
}
