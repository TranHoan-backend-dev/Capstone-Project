package com.capstone.construction.adapter;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.settlement.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.usecase.SettlementUseCase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SettlementControllerTest {

  @Mock
  private SettlementUseCase settlementUseCase;

  @Mock
  private Logger log;

  @InjectMocks
  private SettlementController settlementController;

  private SettlementRequest settlementRequest;
  private SettlementResponse mockResponse;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(settlementController, "log", log);

    settlementRequest = new SettlementRequest(
        "Job Content", "Address", BigDecimal.TEN, "Note", LocalDate.now()
    );

    mockResponse = new SettlementResponse(
        "id-123", "Job Content", "Address", BigDecimal.TEN, "Note",
        LocalDateTime.now(), LocalDateTime.now(), LocalDate.now()
    );
  }

  @Test
  @DisplayName("Create settlement successfully via controller")
  void createSettlement_ShouldReturnCreated() {
    when(settlementUseCase.createSettlement(any(SettlementRequest.class))).thenReturn(mockResponse);

    var responseEntity = settlementController.createSettlement(settlementRequest);

    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(responseEntity.getBody().message()).isEqualTo("Tạo quyết toán công trình thành công");
    verify(settlementUseCase).createSettlement(settlementRequest);
  }

  @Test
  @DisplayName("Update settlement successfully via controller")
  void updateSettlement_ShouldReturnOk() {
    var id = "id-123";
    when(settlementUseCase.updateSettlement(eq(id), any(SettlementRequest.class))).thenReturn(mockResponse);

    var responseEntity = settlementController.updateSettlement(id, settlementRequest);

    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody().message()).isEqualTo("Cập nhật quyết toán công trình thành công");
    verify(settlementUseCase).updateSettlement(id, settlementRequest);
  }

  @Test
  @DisplayName("Get settlement by id successfully via controller")
  void getSettlementById_ShouldReturnOk() {
    var id = "id-123";
    when(settlementUseCase.getSettlementById(id)).thenReturn(mockResponse);

    var responseEntity = settlementController.getSettlementById(id);

    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody().data()).isEqualTo(mockResponse);
    verify(settlementUseCase).getSettlementById(id);
  }

  @Test
  @DisplayName("Get all settlements successfully via controller")
  void getAllSettlements_ShouldReturnOk() {
    var pageable = mock(Pageable.class);
    var pageResponse = new PageResponse<>(List.of(mockResponse), 0, 10, 1, 1, true);
    when(settlementUseCase.getAllSettlements(pageable)).thenReturn(pageResponse);

    var responseEntity = settlementController.getAllSettlements(pageable);

    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody().data()).isEqualTo(pageResponse);
    verify(settlementUseCase).getAllSettlements(pageable);
  }

  @Test
  @DisplayName("Filter settlements successfully via controller")
  void filterSettlements_ShouldReturnOk() {
    var filterRequest = mock(SettlementFilterRequest.class);
    var pageable = mock(Pageable.class);
    var pageResponse = new PageResponse<>(List.of(mockResponse), 0, 10, 1, 1, true);
    when(settlementUseCase.filterSettlements(filterRequest, pageable)).thenReturn(pageResponse);

    var responseEntity = settlementController.filterSettlements(filterRequest, pageable);

    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody().data()).isEqualTo(pageResponse);
    verify(settlementUseCase).filterSettlements(filterRequest, pageable);
  }

  @Test
  @DisplayName("Sign settlement successfully via controller")
  void sign_ShouldReturnOk() {
    var id = "id-123";
    var significanceRequest = new SignificanceRequest("P", "PT", "S", "CP");

    var responseEntity = settlementController.sign(significanceRequest, id);

    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody().message()).isEqualTo("Ký quyết toán thành công");
    verify(settlementUseCase).significance(significanceRequest, id);
  }

  @Test
  @DisplayName("Require significances successfully via controller")
  void requireSignificances_ShouldReturnOk() {
    var assignRequest = new AssignTheSignificanceRequest("id-123", "S", "P", "L", "C");

    var responseEntity = settlementController.requireSignificances(assignRequest);

    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody().message()).isEqualTo("Yêu cầu ký duyệt quyết toán thành công");
    verify(settlementUseCase).assignStaffForSignCostEstimate(assignRequest);
  }
}
