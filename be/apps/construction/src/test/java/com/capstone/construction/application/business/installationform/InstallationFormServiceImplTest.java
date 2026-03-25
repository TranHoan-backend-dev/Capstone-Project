package com.capstone.construction.application.business.installationform;

import com.capstone.common.enumerate.*;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.domain.model.*;
import com.capstone.construction.domain.model.utils.*;
import com.capstone.construction.infrastructure.utils.Message;
import com.capstone.construction.infrastructure.persistence.*;
import com.capstone.construction.infrastructure.service.*;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.*;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
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
  private DeviceService owmSrv;
  @Mock
  private CostEstimateService costEstimateService;

  @InjectMocks
  private InstallationFormServiceImpl service;

  private static final String USER_ID = "EMP-001";

  @Test
  void should_CreateNewInstallationForm_When_ValidRequest() {
    // Given
    var request = createValidNewOrderRequest();
    var network = mock(WaterSupplyNetwork.class);
    var savedEntity = createSavedInstallationForm(request);

    when(owmSrv.isOverallMeterExisting(request.overallWaterMeterId()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, OffsetDateTime.now()));
    when(wsnRepo.findById(request.networkId())).thenReturn(Optional.of(network));
    when(ifRepo.save(any(InstallationForm.class))).thenReturn(savedEntity);

    // When
    var response = service.createNewInstallationForm(USER_ID, request);

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
      "2024-01-01", "2024-01-05", 1, 1, null, "net1", "meter1");
    var network = mock(WaterSupplyNetwork.class);
    var savedEntity = createSavedInstallationForm(request);

    when(owmSrv.isOverallMeterExisting(request.overallWaterMeterId()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, OffsetDateTime.now()));
    when(wsnRepo.findById(request.networkId())).thenReturn(Optional.of(network));
    when(ifRepo.save(any(InstallationForm.class))).thenReturn(savedEntity);

    // When
    var response = service.createNewInstallationForm(USER_ID, request);

    // Then
    assertThat(response).isNotNull();
    verify(ifRepo).save(any(InstallationForm.class));
  }

  @Test
  void should_ThrowException_When_MeterDoesNotExist() {
    // Given
    var request = createValidNewOrderRequest();
    when(owmSrv.isOverallMeterExisting(request.overallWaterMeterId()))
      .thenReturn(new WrapperApiResponse(200, "OK", false, OffsetDateTime.now()));

    // When & Then
    assertThatThrownBy(() -> service.createNewInstallationForm(USER_ID, request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.PT_58);
  }

  @Test
  void should_ThrowException_When_NetworkDoesNotExist() {
    // Given
    var request = createValidNewOrderRequest();
    when(owmSrv.isOverallMeterExisting(request.overallWaterMeterId()))
      .thenReturn(new WrapperApiResponse(200, "OK", true, OffsetDateTime.now()));
    when(wsnRepo.findById(request.networkId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> service.createNewInstallationForm(USER_ID, request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.PT_34);
  }

  @Test
  void should_ThrowException_When_CreateRequestIsNull() {
    assertThatThrownBy(() -> service.createNewInstallationForm(USER_ID, null))
      .isInstanceOf(NullPointerException.class);
  }

  @Test
  void should_GetInstallationForms_When_NoFilters() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();

    when(ifRepo.findAllNotRejectedInstallationForms(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", OffsetDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAllNotRejectedInstallationForms(pageable);
  }

  @Test
  void should_GetInstallationForms_When_KeywordProvided() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest("test", null, null);
    var entity = createMockEntity();

    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", OffsetDateTime.now()));

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
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", OffsetDateTime.now()));

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

    when(ifRepo.findAllNotRejectedInstallationForms(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", OffsetDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAllNotRejectedInstallationForms(pageable);
  }

  @Test
  void should_MapToResponse_When_EmployeeDataIsNull() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();

    when(ifRepo.findAllNotRejectedInstallationForms(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", null, OffsetDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent().get(0).handoverByFullName()).isEqualTo("Trống");
  }

  @Test
  void should_MapToResponse_When_EmployeeNameNotFound() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();

    when(ifRepo.findAllNotRejectedInstallationForms(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(null);

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent().get(0).handoverByFullName()).isEqualTo("Trống");
  }

  @Test
  void should_MapToResponse_When_ScheduleSurveyAtIsNull() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest(null, null, null);
    var entity = createMockEntity();
    when(entity.getScheduleSurveyAt()).thenReturn(null);

    when(ifRepo.findAllNotRejectedInstallationForms(pageable)).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", "Staff", OffsetDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent().getFirst().scheduleSurveyAt()).isNull();
  }

  @Test
  void should_ReturnTrue_When_FormExistsByNumberOrCode() {
    // When
    when(ifRepo.existsById_FormNumberAndId_FormCode("NUM", "CODE")).thenReturn(true);
    var result = service.isInstallationFormExisting("NUM", "CODE");

    // Then
    assertThat(result).isTrue();
  }

  @Test
  void should_ReturnFalse_When_FormDoesNotExist() {
    // When
    when(ifRepo.existsById_FormNumberAndId_FormCode("NUM", "CODE")).thenReturn(false);
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
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", OffsetDateTime.now()));

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

    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any()))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", OffsetDateTime.now()));

    // When
    var result = service.getInstallationForms(pageable, request);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(ifRepo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void should_GetConstructionRequestsList_When_ValidRequest() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var request = new BaseFilterRequest("keyword", "2024-01-01", "2024-01-31");
    var entity = createMockEntity();

    when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(new PageImpl<>(List.of(entity)));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", "Staff", OffsetDateTime.now()));

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
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", "Staff", OffsetDateTime.now()));

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
    // Order: formNumber, formCode, status
    var request = new ApproveRequest("FN01", "FC01", true);
    var entity = createMockEntity();
    var status = new FormProcessingStatus(ProcessingStatus.PENDING_FOR_APPROVAL, ProcessingStatus.PROCESSING,
      ProcessingStatus.PROCESSING, ProcessingStatus.PROCESSING);
    when(entity.getStatus()).thenReturn(status);

    // InstallationFormId: formCode, formNumber
    when(ifRepo.findById(new InstallationFormId("FC01", "FN01"))).thenReturn(Optional.of(entity));

    // When
    service.approveInstallationForm(USER_ID, request);

    // Then
    assertThat(status.getRegistration()).isEqualTo(ProcessingStatus.APPROVED);
    assertThat(status.getEstimate()).isEqualTo(ProcessingStatus.PENDING_FOR_APPROVAL);
    verify(costEstimateService).createEstimate(any(CreateRequest.class));
    verify(ifRepo).save(entity);
  }

  @Test
  void should_Reject_When_StatusIsFalse() {
    // Given
    var request = new ApproveRequest("FN01", "FC01", false);
    var entity = createMockEntity();
    var status = new FormProcessingStatus(ProcessingStatus.PENDING_FOR_APPROVAL, ProcessingStatus.PROCESSING,
      ProcessingStatus.PROCESSING, ProcessingStatus.PROCESSING);
    when(entity.getStatus()).thenReturn(status);

    when(ifRepo.findById(new InstallationFormId("FC01", "FN01"))).thenReturn(Optional.of(entity));

    // When
    service.approveInstallationForm(USER_ID, request);

    // Then
    assertThat(status.getRegistration()).isEqualTo(ProcessingStatus.REJECTED);
    verify(ifRepo).save(entity);
  }

  @Test
  void should_ThrowException_When_FormNotFoundInApprove() {
    // Given
    var request = new ApproveRequest("F-001", "C-001", true);
    when(ifRepo.findById(new InstallationFormId("C-001", "F-001"))).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> service.approveInstallationForm(USER_ID, request))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void should_GetByFormCodeAndNumber_When_Exists() {
    // Given
    var entity = createMockEntity();
    when(ifRepo.findById(new InstallationFormId("FC01", "FN01"))).thenReturn(Optional.of(entity));
    when(empSrv.getEmployeeNameById(any())).thenReturn(new WrapperApiResponse(200, "OK", "Staff", OffsetDateTime.now()));

    // When
    var result = service.getByFormCodeAndFormNumber("FC01", "FN01");

    // Then
    assertThat(result).isNotNull();
    assertThat(result.formCode()).isEqualTo("FC01");
  }

  @Test
  void should_ThrowException_When_NotFoundInGetByCodeAndNumber() {
    // When & Then
    when(ifRepo.findById(new InstallationFormId("C-001", "F-001"))).thenReturn(Optional.empty());
    assertThatThrownBy(() -> service.getByFormCodeAndFormNumber("C-001", "F-001"))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.PT_36);
  }

  // Helper methods
  private @NonNull NewOrderRequest createValidNewOrderRequest() {
    return new NewOrderRequest(
      "F-001", "NUM-001", "Customer Name", "123 Address", "123456789012", "2000-01-01", "Hanoi",
      "0912345678", "TAX-001", "BANK-001", "Hanoi", UsageTarget.COMMERCIAL, CustomerType.COMPANY,
      "2024-01-01", "2024-01-05", 4, 1, new ArrayList<>(), "NET-001", "METER-001");
  }

  private @NonNull InstallationForm createSavedInstallationForm(@NonNull NewOrderRequest request) {
    var form = mock(InstallationForm.class);
    when(form.getFormNumber()).thenReturn(request.formNumber());
    when(form.getCustomerName()).thenReturn(request.customerName());
    when(form.getFormCode()).thenReturn(request.formCode());
    when(form.getCreatedBy()).thenReturn(USER_ID);
    when(form.getCreatedAt()).thenReturn(LocalDateTime.now());
    return form;
  }

  private @NonNull InstallationForm createMockEntity() {
    var entity = mock(InstallationForm.class);
    when(entity.getFormCode()).thenReturn("FC01");
    when(entity.getFormNumber()).thenReturn("FN01");
    when(entity.getCustomerName()).thenReturn("Customer");
    when(entity.getAddress()).thenReturn("Address");
    when(entity.getPhoneNumber()).thenReturn("0912345678");
    when(entity.getScheduleSurveyAt()).thenReturn(LocalDate.now());
    when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());
    when(entity.getCreatedBy()).thenReturn("EMP01");
    when(entity.getHandoverBy()).thenReturn("EMP02");
    when(entity.getConstructedBy()).thenReturn("EMP03");
    var status = new FormProcessingStatus();
    status.setRegistration(ProcessingStatus.PROCESSING);
    when(entity.getStatus()).thenReturn(status);
    return entity;
  }
}
