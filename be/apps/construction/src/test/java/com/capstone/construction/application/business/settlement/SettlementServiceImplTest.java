package com.capstone.construction.application.business.settlement;

import com.capstone.common.enumerate.RoleName;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.domain.model.Settlement;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.domain.model.utils.significance.SettlementSignificance;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.SettlementRepository;
import com.capstone.construction.infrastructure.service.EmployeeService;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SettlementServiceImplTest {

  @Mock
  SettlementRepository settlementRepository;

  @Mock
  InstallationFormRepository formRepository;

  @Mock
  EmployeeService empSrv;

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
    var request = new SettlementRequest("CODE-001", "FORM-001", "Job", "Addr", BigDecimal.TEN, "Note", LocalDate.now());
    var form = mock(InstallationForm.class);
    when(form.getFormCode()).thenReturn("CODE-001");
    when(form.getFormNumber()).thenReturn("FORM-001");

    var settlement = Settlement.create(b -> b
        .jobContent(request.jobContent())
        .address(request.address())
        .connectionFee(request.connectionFee())
        .note(request.note())
        .installationForm(form)
        .registrationAt(request.registrationAt()));

    when(formRepository.findById(any(InstallationFormId.class))).thenReturn(Optional.of(form));
    when(settlementRepository.save(any(Settlement.class))).thenReturn(settlement);

    var result = settlementService.createSettlement(request);

    assertThat(result.jobContent()).isEqualTo(request.jobContent());
    verify(settlementRepository).save(any(Settlement.class));
  }

  @Test
  @DisplayName("Update settlement successfully")
  void updateSettlement_ShouldUpdateAndReturnResponse() {
    var id = "id123";
    var request = new SettlementRequest("CODE-001", "FORM-001", "New Job", "New Addr", BigDecimal.ONE, "New Note", LocalDate.now());
    var form = mock(InstallationForm.class);
    when(form.getFormCode()).thenReturn("CODE-001");
    when(form.getFormNumber()).thenReturn("FORM-001");

    var existing = Settlement.create(b -> b.jobContent("Old").address("Old").connectionFee(BigDecimal.ZERO).note("Old").installationForm(form).registrationAt(LocalDate.now()));

    when(settlementRepository.findById(id)).thenReturn(Optional.of(existing));
    when(settlementRepository.save(any(Settlement.class))).thenAnswer(invocation -> invocation.getArgument(0));

    var result = settlementService.updateSettlement(id, request);

    assertThat(result.jobContent()).isEqualTo("New Job");
    assertThat(existing.getJobContent()).isEqualTo("New Job");
  }

  @Test
  @DisplayName("Update settlement should throw if not found")
  void updateSettlement_ShouldThrow_WhenNotFound() {
    when(settlementRepository.findById(anyString())).thenReturn(Optional.empty());

    assertThatThrownBy(() -> settlementService.updateSettlement("id", mock(SettlementRequest.class)))
        .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  @DisplayName("Get settlement by id successfully")
  void getSettlementById_ShouldReturnResponse() {
    var id = "id123";
    var form = mock(InstallationForm.class);
    when(form.getFormCode()).thenReturn("CODE-001");
    when(form.getFormNumber()).thenReturn("FORM-001");

    var existing = Settlement.create(b -> b.jobContent("Job").address("Addr").connectionFee(BigDecimal.ZERO).note("Note").installationForm(form).registrationAt(LocalDate.now()));

    when(settlementRepository.findById(id)).thenReturn(Optional.of(existing));

    var result = settlementService.getSettlementById(id);

    assertThat(result.jobContent()).isEqualTo("Job");
  }

  @Test
  @DisplayName("Get all settlements successfully")
  void getAllSettlements_ShouldReturnPageResponse() {
    var pageable = mock(Pageable.class);
    Page<Settlement> page = new PageImpl<>(List.of());

    when(settlementRepository.findAll(pageable)).thenReturn(page);

    var result = settlementService.getAllSettlements(pageable);

    assertThat(result.content()).isEmpty();
  }

  @Test
  @DisplayName("Filter settlements successfully")
  void filterSettlements_ShouldReturnPageResponse() {
    var filter = mock(SettlementFilterRequest.class);
    var pageable = mock(Pageable.class);
    Page<Settlement> page = new PageImpl<>(List.of());

    when(settlementRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

    var result = settlementService.filterSettlements(filter, pageable);

    assertThat(result.content()).isEmpty();
  }

  @Test
  @DisplayName("Sign settlement - Fully signed")
  void signSettlement_ShouldReturnTrue_WhenFullySigned() {
    var id = "id123";
    var userId = "User1";
    var request = new SignificanceRequest("URL");
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
    var request = new SignificanceRequest("URL");
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

