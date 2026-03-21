package com.capstone.construction.application.usecase;

import com.capstone.common.exception.NotExistingException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.business.settlement.SettlementService;
import com.capstone.construction.application.dto.request.settlement.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.infrastructure.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SettlementUseCaseTest {

  @Mock
  SettlementService settlementService;

  @Mock
  MessageProducer messageProducer;

  @Mock
  EmployeeService employeeService;

  @InjectMocks
  SettlementUseCase settlementUseCase;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(settlementUseCase, "PREFIX", ".settlement.");
    ReflectionTestUtils.setField(settlementUseCase, "APPROVE_ACTION", "approve");
    ReflectionTestUtils.setField(settlementUseCase, "REQUIRE_SIGNIFICANCE_ACTION", "require-significance");
    ReflectionTestUtils.setField(settlementUseCase, "QUEUE_NAME", "construction_queue");
  }

  @Test
  @DisplayName("Create settlement successfully")
  void createSettlement_ShouldReturnResponse() {
    var request = new SettlementRequest("CODE-001", "FORM-001", "Job", "Addr", BigDecimal.ZERO, "Note", LocalDate.now());
    var response = new SettlementResponse("id", "Job", "Addr", BigDecimal.ZERO, "Note", null, null, LocalDate.now(), "CODE-001", "FORM-001", null);

    when(settlementService.createSettlement(request)).thenReturn(response);

    var result = settlementUseCase.createSettlement(request);

    assertThat(result).isEqualTo(response);
    verify(settlementService).createSettlement(request);
  }

  @Test
  @DisplayName("Update settlement successfully")
  void updateSettlement_ShouldReturnResponse() {
    var id = "id123";
    var request = new SettlementRequest("CODE-001", "FORM-001", "Job", "Addr", BigDecimal.ZERO, "Note", LocalDate.now());
    var response = new SettlementResponse(id, "Job", "Addr", BigDecimal.ZERO, "Note", null, null, LocalDate.now(), "CODE-001", "FORM-001", null);

    when(settlementService.updateSettlement(id, request)).thenReturn(response);

    var result = settlementUseCase.updateSettlement(id, request);

    assertThat(result).isEqualTo(response);
    verify(settlementService).updateSettlement(id, request);
  }

  @Test
  @DisplayName("Get settlement by id successfully")
  void getSettlementById_ShouldReturnResponse() {
    var id = "id123";
    var response = new SettlementResponse(id, "Job", "Addr", BigDecimal.ZERO, "Note", null, null, LocalDate.now(), "CODE-001", "FORM-001", null);

    when(settlementService.getSettlementById(id)).thenReturn(response);

    var result = settlementUseCase.getSettlementById(id);

    assertThat(result).isEqualTo(response);
    verify(settlementService).getSettlementById(id);
  }

  @Test
  @DisplayName("Get all settlements successfully")
  void getAllSettlements_ShouldReturnPageResponse() {
    var pageable = mock(Pageable.class);
    PageResponse<SettlementResponse> pageResponse = new PageResponse<>(List.of(), 0, 10, 0, 0, true);

    when(settlementService.getAllSettlements(pageable)).thenReturn(pageResponse);

    var result = settlementUseCase.getAllSettlements(pageable);

    assertThat(result).isEqualTo(pageResponse);
    verify(settlementService).getAllSettlements(pageable);
  }

  @Test
  @DisplayName("Significance should send message when fully signed")
  void significance_ShouldSendMessage_WhenFullySigned() {
    var id = "id123";
    var request = new SignificanceRequest("P", "PT", "S", "CP");

    when(settlementService.signSettlement(request, id)).thenReturn(true);

    settlementUseCase.significance(request, id);

    verify(messageProducer).send(eq("construction_queue.settlement.approve"), any());
  }

  @Test
  @DisplayName("Significance should not send message when not fully signed")
  void significance_ShouldNotSendMessage_WhenNotFullySigned() {
    var id = "id123";
    var request = new SignificanceRequest("P", "PT", "S", "CP");

    when(settlementService.signSettlement(request, id)).thenReturn(false);

    settlementUseCase.significance(request, id);

    verify(messageProducer, never()).send(anyString(), any());
  }

  @Test
  @DisplayName("Assign staff for sign successfully")
  void assignStaffForSignCostEstimate_ShouldSendMessage() {
    var request = new AssignTheSignificanceRequest("sid", "ss", "ph", "cl", "cp");

    when(employeeService.isEmployeeExisting(anyString())).thenReturn(new WrapperApiResponse(200, "ok", true, null));
    when(settlementService.isExistingSettlement("sid")).thenReturn(true);

    settlementUseCase.assignStaffForSignCostEstimate(request);

    verify(messageProducer).send(eq("construction_queue.settlement.require-significance"), any());
  }

  @Test
  @DisplayName("Assign staff should throw exception when employee not found")
  void assignStaffForSignCostEstimate_ShouldThrow_WhenEmployeeNotFound() {
    var request = new AssignTheSignificanceRequest("sid", "ss", "ph", "cl", "cp");

    when(employeeService.isEmployeeExisting(anyString())).thenReturn(new WrapperApiResponse(200, "err", false, null));

    assertThatThrownBy(() -> settlementUseCase.assignStaffForSignCostEstimate(request))
        .isInstanceOf(NotExistingException.class);

    verify(messageProducer, never()).send(anyString(), any());
  }

  @Test
  @DisplayName("Assign staff should throw exception when settlement not found")
  void assignStaffForSignCostEstimate_ShouldThrow_WhenSettlementNotFound() {
    var request = new AssignTheSignificanceRequest("sid", "ss", "ph", "cl", "cp");

    when(employeeService.isEmployeeExisting(anyString())).thenReturn(new WrapperApiResponse(200, "ok", true, null));
    when(settlementService.isExistingSettlement("sid")).thenReturn(false);

    assertThatThrownBy(() -> settlementUseCase.assignStaffForSignCostEstimate(request))
        .isInstanceOf(NotExistingException.class);

    verify(messageProducer, never()).send(anyString(), any());
  }
}
