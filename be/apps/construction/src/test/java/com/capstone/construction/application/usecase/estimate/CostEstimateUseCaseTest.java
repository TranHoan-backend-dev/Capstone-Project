package com.capstone.construction.application.usecase.estimate;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.usecase.CostEstimateUseCase;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.common.enumerate.RoleName;
import com.capstone.common.exception.ForbiddenException;
import com.capstone.common.exception.NotExistingException;
import com.capstone.construction.application.dto.request.estimate.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.estimate.SignRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CostEstimateUseCaseTest {

  @Mock
  private CostEstimateService estSrv;

  @Mock
  private EmployeeService empSrv;

  @Mock
  private MessageProducer messageProducer;

  @InjectMocks
  private CostEstimateUseCase costEstimateUseCase;

  private CreateRequest createRequest;
  private UpdateRequest updateRequest;
  private CostEstimateResponse mockResponse;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(costEstimateUseCase, "COST_ESTIMATE_PREFIX", ".ESTIMATE.");
    ReflectionTestUtils.setField(costEstimateUseCase, "FINANCE_PREFIX", ".FINANCE.");
    ReflectionTestUtils.setField(costEstimateUseCase, "UPDATE_ACTION", "UPDATE");
    ReflectionTestUtils.setField(costEstimateUseCase, "APPROVE_ACTION", "APPROVE");
    ReflectionTestUtils.setField(costEstimateUseCase, "REQUIRE_SIGNIFICANCE_ACTION", "SIGN");
    ReflectionTestUtils.setField(costEstimateUseCase, "VIEW_ACTION", "VIEW");
    ReflectionTestUtils.setField(costEstimateUseCase, "QUEUE_NAME", "QUEUE");

    var formCode = "FOR-001";
    var formNumber = "NUM-001";
    createRequest = new CreateRequest(
      "Customer Name", "Address", LocalDateTime.now(), "user-123", formCode, formNumber, "OWM-123");

    updateRequest = new UpdateRequest(
      "Name", "Addr", "Note", 100, 100, 1, 100, 1, 1, 1, 1, 1, 1, 100, null, "SN", "METER", true);

    mockResponse = new CostEstimateResponse(
      "id-123", "Customer Name", "Address", "Note", 1000, 500, 1, 2000, 10, 5, 10, 5, 10, 2, 100, "url",
      LocalDateTime.now(), LocalDateTime.now(), LocalDate.now(), "user-123", "SN123", "METER-123",
      new InstallationFormId(formCode, formNumber));
  }

  @Test
  void should_CreateEstimate_When_InstallationFormExists() {
    // Arrange
    when(estSrv.createEstimate(createRequest)).thenReturn(mockResponse);

    // Act
    var response = costEstimateUseCase.createEstimate(createRequest);

    // Assert
    assertNotNull(response);
    verify(estSrv).createEstimate(createRequest);
  }

  @Test
  void should_UpdateEstimate_Success() {
    // Arrange
    when(estSrv.updateEstimate(anyString(), any(UpdateRequest.class))).thenReturn(mockResponse);
    when(empSrv.getEmployeeNameById(anyString()))
      .thenReturn(new WrapperApiResponse(200, "Success", "Updated By Employee", LocalDateTime.now()));

    // Act
    var response = costEstimateUseCase.updateEstimate("id-123", updateRequest);

    // Assert
    assertNotNull(response);
    verify(estSrv).updateEstimate("id-123", updateRequest);
    verify(messageProducer).send(anyString(), any());
  }

  @Test
  void should_ApproveEstimate_Success() {
    // Arrange
    when(estSrv.getEstimateById("id-123")).thenReturn(mockResponse);
    when(empSrv.getEmployeeNameById(anyString()))
      .thenReturn(new WrapperApiResponse(200, "Success", "Employee", LocalDateTime.now()));

    // Act
    var response = costEstimateUseCase.approveEstimate("id-123", true);

    // Assert
    assertNotNull(response);
    verify(estSrv).approveEstimate("id-123", true);
    verify(messageProducer).send(anyString(), any());
  }

  @Test
  void should_GetEstimateById_Success() {
    // Arrange
    when(estSrv.getEstimateById("id-123")).thenReturn(mockResponse);

    // Act
    CostEstimateResponse response = costEstimateUseCase.getEstimateById("id-123");

    // Assert
    assertNotNull(response);
    assertEquals("id-123", response.estimationId());
  }

  @Test
  void should_GetAllEstimates_Success() {
    // Act
    PageResponse<CostEstimateResponse> mockPageResponse = new PageResponse<>(Collections.emptyList(), 0, 10, 0, 0,
      true);
    when(estSrv.getAllEstimates(any(), any())).thenReturn(mockPageResponse);

    costEstimateUseCase.getAllEstimates(null, null);

    // Assert
    verify(estSrv).getAllEstimates(null, null);
  }

  @Test
  void should_AssignStaffForSignCostEstimate_Success() {
    // Arrange
    var request = new AssignTheSignificanceRequest(
      "EST001", "EMP001", "EMP002", "EMP003");
    when(estSrv.isExisting("EST001")).thenReturn(true);
    when(empSrv.isEmployeeExisting(anyString())).thenReturn(new WrapperApiResponse(200, "Success", "true", LocalDateTime.now()));

    // Act
    costEstimateUseCase.assignStaffForSignCostEstimate(request);

    // Assert
    verify(messageProducer).send(anyString(), any());
  }

  @Test
  void should_ThrowException_When_EstimateNotExisting_In_AssignStaff() {
    // Arrange
    var request = new AssignTheSignificanceRequest(
      "EST001", "EMP001", "EMP002", "EMP003");
    when(estSrv.isExisting("EST001")).thenReturn(false);

    // Act & Assert
    assertThrows(NotExistingException.class,
      () -> costEstimateUseCase.assignStaffForSignCostEstimate(request));
  }

  @Test
  void should_ThrowException_When_AllEmployeesNotExisting_In_AssignStaff() {
    // Arrange
    var request = new AssignTheSignificanceRequest(
      "EST001", "EMP001", "EMP002", "EMP003");
    when(estSrv.isExisting("EST001")).thenReturn(true);
    when(empSrv.isEmployeeExisting(anyString())).thenReturn(new WrapperApiResponse(200, "Success", "false", LocalDateTime.now()));

    // Act & Assert
    assertThrows(NotExistingException.class,
      () -> costEstimateUseCase.assignStaffForSignCostEstimate(request));
  }

  @Test
  void should_SignForInstallationRequest_Success_As_SurveyStaff() {
    // Arrange
    var request = new SignRequest("EST001", "url");
    when(empSrv.getRoleOfEmployeeById("user-123")).thenReturn(new WrapperApiResponse(200, "Success", "SURVEY_STAFF", LocalDateTime.now()));
    when(empSrv.getElectronicSignificance("user-123")).thenReturn(new WrapperApiResponse(200, "Success", "sign-data", LocalDateTime.now()));
    when(estSrv.signForCostEstimate(anyString(), eq(RoleName.SURVEY_STAFF), eq("EST001"))).thenReturn(true);

    // Act
    costEstimateUseCase.signForInstallationRequest("user-123", request);

    // Assert
    verify(estSrv).signForCostEstimate("sign-data", RoleName.SURVEY_STAFF, "EST001");
    verify(messageProducer).send(anyString(), isNull());
  }

  @Test
  void should_SignForInstallationRequest_Success_As_PlanningHead() {
    // Arrange
    var request = new SignRequest("EST001", "url");
    when(empSrv.getRoleOfEmployeeById("user-123")).thenReturn(new WrapperApiResponse(200, "Success", "PLANNING_TECHNICAL_DEPARTMENT_HEAD", LocalDateTime.now()));
    when(empSrv.getElectronicSignificance("user-123")).thenReturn(new WrapperApiResponse(200, "Success", "sign-data", LocalDateTime.now()));
    when(estSrv.signForCostEstimate(anyString(), eq(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD), eq("EST001"))).thenReturn(true);

    // Act
    costEstimateUseCase.signForInstallationRequest("user-123", request);

    // Assert
    verify(estSrv).signForCostEstimate("sign-data", RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD, "EST001");
    verify(messageProducer).send(anyString(), isNull());
  }

  @Test
  void should_SignForInstallationRequest_Success_As_Leadership() {
    // Arrange
    var request = new SignRequest("EST001", "url");
    when(empSrv.getRoleOfEmployeeById("user-123")).thenReturn(new WrapperApiResponse(200, "Success", "COMPANY_LEADERSHIP", LocalDateTime.now()));
    when(empSrv.getElectronicSignificance("user-123")).thenReturn(new WrapperApiResponse(200, "Success", "sign-data", LocalDateTime.now()));
    when(estSrv.signForCostEstimate(anyString(), eq(RoleName.COMPANY_LEADERSHIP), eq("EST001"))).thenReturn(true);

    // Act
    costEstimateUseCase.signForInstallationRequest("user-123", request);

    // Assert
    verify(estSrv).signForCostEstimate("sign-data", RoleName.COMPANY_LEADERSHIP, "EST001");
    verify(messageProducer).send(anyString(), isNull());
  }

  @Test
  void should_ThrowException_When_UserHasInvalidRole() {
    // Arrange
    var request = new SignRequest("EST001", "url");
    when(empSrv.getRoleOfEmployeeById("user-123")).thenReturn(new WrapperApiResponse(200, "Success", "IT_STAFF", LocalDateTime.now()));

    // Act & Assert
    assertThrows(ForbiddenException.class,
      () -> costEstimateUseCase.signForInstallationRequest("user-123", request));
  }
}
