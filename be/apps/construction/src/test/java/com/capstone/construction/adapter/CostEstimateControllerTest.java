package com.capstone.construction.adapter;

import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.estimate.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.estimate.SignRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.usecase.CostEstimateUseCase;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.test.util.ReflectionTestUtils;

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
class CostEstimateControllerTest {

  @Mock
  private CostEstimateUseCase estimateUseCase;

  @Mock
  private Logger log;

  @InjectMocks
  private CostEstimateController estimateController;

  private UpdateRequest updateRequest;
  private CostEstimateResponse mockResponse;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(estimateController, "log", log);

    updateRequest = new UpdateRequest(
      "Customer", "Address", "Note", 1000, 100, 1, 1000, 1, 1, 1, 1, 1, 1, 100, null, "SN", "METER"
      , false);

    mockResponse = new CostEstimateResponse(
      new CostEstimateResponse.GeneralInformation(
        "id", "Customer", "Address", "Note", 1000, 100, 1, 1000, 1, 1, 1, 1, 1, 1, 100, "url",
        LocalDateTime.now(), LocalDateTime.now(), LocalDate.now(), "user", "SN", "METER",
        new InstallationFormId("CODE", "NUM")
      ),
      Collections.emptyList()
    );
  }

  @Test
  void should_ReturnOk_When_UpdateEstimate() {
    // Arrange
    var id = "id-123";
    when(estimateUseCase.updateEstimate(eq(id), any(UpdateRequest.class))).thenReturn(mockResponse);

    // Act
    var responseEntity = estimateController.updateEstimate(id, updateRequest);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Cập nhật dự toán chi phí thành công");
    verify(estimateUseCase).updateEstimate(id, updateRequest);
  }

  @Test
  void should_ReturnOk_When_GetEstimateById() {
    // Arrange
    var id = "id-123";
    when(estimateUseCase.getEstimateById(id)).thenReturn(mockResponse);

    // Act
    var responseEntity = estimateController.getEstimateById(id);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().data()).isEqualTo(mockResponse);
    verify(estimateUseCase).getEstimateById(id);
  }

  @Test
  void should_ReturnOk_When_GetAllEstimates() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    var filter = new BaseFilterRequest(null, null, null);
    var pageResponse = new PageResponse<>(List.of(mockResponse), 0, 10, 1, 1, true);
    when(estimateUseCase.getAllEstimates(pageable, filter)).thenReturn(pageResponse);

    // Act
    var responseEntity = estimateController.getAllEstimates(pageable, filter);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Lấy danh sách dự toán chi phí thành công");
    assertThat(responseEntity.getBody().data()).isEqualTo(pageResponse);
    verify(estimateUseCase).getAllEstimates(pageable, filter);
  }

  @Test
  void should_ReturnOk_When_ApproveEstimate() {
    // Arrange
    var id = "id-123";
    var status = true;
    when(estimateUseCase.approveEstimate(id, status)).thenReturn(mockResponse);

    // Act
    var responseEntity = estimateController.approveEstimate(id, status);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Duyệt dự toán chi phí thành công");
    assertThat(responseEntity.getBody().data()).isEqualTo(mockResponse);
    verify(estimateUseCase).approveEstimate(id, status);
  }

  @Test
  void should_ReturnOk_When_RequireSignificances() {
    // Arrange
    var request = new AssignTheSignificanceRequest("EST-001", "EMP001", "EMP002", "EMP003");

    // Act
    var responseEntity = estimateController.requireSignificances(request);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Yêu cầu ký duyệt dự toán thành công");
    verify(estimateUseCase).assignStaffForSignCostEstimate(request);
  }

  @Test
  void should_ReturnOk_When_Sign() {
    // Arrange
    var request = new SignRequest("EST-001", "url");
    var jwt = org.mockito.Mockito.mock(Jwt.class);
    when(jwt.getSubject()).thenReturn("user-id");

    // Act
    var responseEntity = estimateController.sign(request, jwt);

    // Assert
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(responseEntity.getBody()).isNotNull();
    assertThat(responseEntity.getBody().message()).isEqualTo("Ký dự toán thành công");
    verify(estimateUseCase).signForInstallationRequest("user-id", request);
  }
}
