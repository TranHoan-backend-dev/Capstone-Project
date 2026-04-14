package com.capstone.construction.application.business.settlement;

import com.capstone.common.enumerate.RoleName;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.CreateSettlementRequest;
import com.capstone.construction.application.dto.request.settlement.UpdateSettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.domain.model.Settlement;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.domain.model.utils.significance.SettlementSignificance;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.SettlementRepository;
import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.construction.infrastructure.service.DeviceService;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import org.junit.jupiter.api.BeforeEach;
import org.slf4j.Logger;
import org.springframework.test.util.ReflectionTestUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SettlementServiceImplTest {

  @Mock
  SettlementRepository settlementRepository;

  @Mock
  InstallationFormRepository formRepository;

  @Mock
  EmployeeService empSrv;

  @Mock
  CostEstimateService costEstimateService;

  @Mock
  DeviceService deviceSrv;

  @InjectMocks
  SettlementServiceImpl settlementService;

  @Mock
  Logger log;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(settlementService, "log", log);
  }

  @Test
  @DisplayName("Create settlement successfully")
  void createSettlement_ShouldSaveAndReturnResponse() {
    var request = new CreateSettlementRequest("SETTLE-001", "1001", "1", "Job", "Customer A", "Addr", BigDecimal.TEN, "Note", LocalDate.now());
    var form = mock(InstallationForm.class);
    when(form.getFormCode()).thenReturn("1001");
    when(form.getFormNumber()).thenReturn("1");

    var settlement = Settlement.create(b -> b
      .settlementId(request.settlementId())
      .jobContent(request.jobContent())
      .customerName(request.customerName())
      .address(request.address())
      .connectionFee(request.connectionFee())
      .note(request.note())
      .installationForm(form)
      .registrationAt(request.registrationAt()));

    when(formRepository.findById(any(InstallationFormId.class))).thenReturn(Optional.of(form));
    when(settlementRepository.save(any(Settlement.class))).thenReturn(settlement);
    var ceResponse = mock(CostEstimateResponse.class);
    when(ceResponse.material()).thenReturn(List.of());
    when(costEstimateService.getByFormCode(anyString())).thenReturn(ceResponse);
    when(deviceSrv.updateMaterialsOfSettlement(anyString(), anyList())).thenReturn(new WrapperApiResponse(200, "ok", null, null));

    var result = settlementService.createSettlement(request);

    assertThat(result.generalInformation().jobContent()).isEqualTo(request.jobContent());
    verify(settlementRepository).save(any(Settlement.class));
  }

  @Test
  @DisplayName("Update settlement successfully")
  void updateSettlement_ShouldUpdateAndReturnResponse() {
    var id = "SETTLE-001";
    var request = new UpdateSettlementRequest(id, "New Job", "New Customer", "New Addr", BigDecimal.ONE, "New Note", LocalDate.now(), null);
    var form = mock(InstallationForm.class);
    when(form.getFormCode()).thenReturn("1001");
    when(form.getFormNumber()).thenReturn("1");

    var existing = Settlement.create(b -> b.settlementId(id).jobContent("Old").customerName("Old").address("Old").connectionFee(BigDecimal.ZERO).note("Old").installationForm(form).registrationAt(LocalDate.now()));

    when(settlementRepository.findById(id)).thenReturn(Optional.of(existing));
    when(settlementRepository.save(any(Settlement.class))).thenAnswer(invocation -> invocation.getArgument(0));
    when(deviceSrv.getMaterialsOfSettlement(anyString())).thenReturn(List.of());

    var result = settlementService.updateSettlement(id, request);

    assertThat(result.generalInformation().jobContent()).isEqualTo("New Job");
    assertThat(existing.getCustomerName()).isEqualTo("New Customer");
  }

  @Test
  @DisplayName("Update settlement should throw if not found")
  void updateSettlement_ShouldThrow_WhenNotFound() {
    when(settlementRepository.findById(anyString())).thenReturn(Optional.empty());

    assertThatThrownBy(() -> settlementService.updateSettlement("id", mock(UpdateSettlementRequest.class)))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  @DisplayName("Get settlement by id successfully")
  void getSettlementById_ShouldReturnResponse() {
    var id = "id123";
    var form = mock(InstallationForm.class);
    when(form.getFormCode()).thenReturn("1001");
    when(form.getFormNumber()).thenReturn("1");

    var existing = Settlement.create(b -> b.settlementId(id).jobContent("Job").customerName("Customer").address("Addr").connectionFee(BigDecimal.ZERO).note("Note").installationForm(form).registrationAt(LocalDate.now()));

    when(settlementRepository.findByIdWithInstallationForm(id)).thenReturn(Optional.of(existing));
    when(deviceSrv.getMaterialsOfSettlement(anyString())).thenReturn(List.of());
    var result = settlementService.getSettlementById(id);

    assertThat(result.generalInformation().jobContent()).isEqualTo("Job");
  }

  @Test
  @DisplayName("Get all settlements successfully")
  void getAllSettlements_ShouldReturnPageResponse() {
    var pageable = mock(Pageable.class);
    Page<Settlement> page = new PageImpl<>(List.of());

    when(settlementRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

    var result = settlementService.getAllSettlements(pageable);

    assertThat(result.content()).isEmpty();
  }

  @Test
  @DisplayName("Filter settlements successfully")
  void filterSettlements_ShouldReturnPageResponse() {
    var filter = mock(SettlementFilterRequest.class);
    var pageable = mock(Pageable.class);
    Page<Settlement> page = new PageImpl<>(List.of());

    when(settlementRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

    var result = settlementService.filterSettlements(filter, pageable);

    assertThat(result.content()).isEmpty();
  }

  @Test
  @DisplayName("Sign settlement - Fully signed")
  void signSettlement_ShouldReturnTrue_WhenFullySigned() {
    var id = "id123";
    var userId = "User1";
    var request = new SignificanceRequest("URL", null);
    var significance = mock(SettlementSignificance.class);
    var settlement = mock(Settlement.class);

    when(settlement.getSignificance()).thenReturn(significance);
    when(settlementRepository.findById(id)).thenReturn(Optional.of(settlement));
    when(empSrv.getRoleOfEmployeeById(userId)).thenReturn(new WrapperApiResponse(200, "ok", RoleName.SURVEY_STAFF, null));
    when(significance.isSettlementFullySigned()).thenReturn(true);

    var result = settlementService.signSettlement(userId, id, request);

    assertThat(result).isTrue();
  }

  @Test
  @DisplayName("Sign settlement - Partially signed")
  void signSettlement_ShouldReturnFalse_WhenPartiallySigned() {
    var id = "id123";
    var userId = "User1";
    var request = new SignificanceRequest("URL", null);
    var significance = mock(SettlementSignificance.class);
    var settlement = mock(Settlement.class);

    when(settlement.getSignificance()).thenReturn(significance);
    when(settlementRepository.findById(id)).thenReturn(Optional.of(settlement));
    when(empSrv.getRoleOfEmployeeById(userId)).thenReturn(new WrapperApiResponse(200, "ok", RoleName.SURVEY_STAFF, null));
    when(significance.isSettlementFullySigned()).thenReturn(false);

    var result = settlementService.signSettlement(userId, id, request);

    assertThat(result).isFalse();
  }
}

