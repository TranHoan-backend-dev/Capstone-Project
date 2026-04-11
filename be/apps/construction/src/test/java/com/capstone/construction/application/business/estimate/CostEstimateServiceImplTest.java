package com.capstone.construction.application.business.estimate;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.request.BaseFilterRequest;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.EstimateFilterRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.FormProcessingStatus;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.service.GcsService;
import com.capstone.construction.infrastructure.service.DeviceService;
import com.capstone.common.response.WrapperApiResponse;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CostEstimateServiceImplTest {

  @Mock
  private CostEstimateRepository eRepo;

  @Mock
  private InstallationFormRepository ifRepo;

  @Mock
  private GcsService gcsService;

  @Mock
  private DeviceService owmSrv;

  @InjectMocks
  private CostEstimateServiceImpl costEstimateService;

  private CreateRequest createRequest;
  private UpdateRequest updateRequest;
  private CostEstimate costEstimate;
  private InstallationForm installationForm;
  private final String estimateId = "estimate-123";
  private final String formCode = "1001";
  private final String formNumber = "1001";

  @BeforeEach
  void setUp() {
    createRequest = new CreateRequest(
      "Customer Name",
      "Address",
      LocalDateTime.now(),
      "user-123",
      formCode,
      formNumber,
      "METER-123");

    updateRequest = new UpdateRequest(
      new UpdateRequest.GeneralInformation(
        "Updated Name",
        "Updated Address",
        "Updated Note",
        1200,
        600,
        2,
        2200,
        15,
        6,
        10,
        6,
        10,
        3,
        120,
        null,
        "SN123-UPDATED",
        "METER-123-UPDATED",
        null),
      Collections.emptyList(),
      true);

    installationForm = new InstallationForm();
    installationForm.setFormCode(formCode);
    installationForm.setFormNumber(formNumber);

    costEstimate = CostEstimate.builder()
      .customerName(createRequest.customerName())
      .address(createRequest.address())
      .registrationAt(createRequest.registrationAt().toLocalDate())
      .createBy(createRequest.createBy())
      .overallWaterMeterId(createRequest.overallWaterMeterId())
      .installationForm(installationForm)
      .build();
  }

  @Test
  void should_CreateEstimate_When_ValidRequest() {
    // Arrange
    installationForm.setStatus(new FormProcessingStatus(ProcessingStatus.PROCESSING, ProcessingStatus.PENDING_FOR_APPROVAL, ProcessingStatus.PENDING_FOR_APPROVAL, ProcessingStatus.PENDING_FOR_APPROVAL));

    when(ifRepo.findById(new InstallationFormId(formCode, formNumber))).thenReturn(Optional.of(installationForm));
    when(eRepo.existsByInstallationForm(installationForm)).thenReturn(false);
    when(eRepo.save(any(CostEstimate.class))).thenReturn(costEstimate);
    when(owmSrv.updateMaterialsOfCostEstimate(any(), any())).thenReturn(new WrapperApiResponse(200, "Success", null, OffsetDateTime.now()));
    when(owmSrv.getDefaultMaterials()).thenReturn(Collections.emptyList());

    // Act
    var response = costEstimateService.createEstimate(createRequest);

    // Assert
    assertNotNull(response);
    assertEquals(createRequest.customerName(), response.generalInformation().customerName());
    verify(eRepo).save(any(CostEstimate.class));
    verify(ifRepo).save(any(InstallationForm.class));
    assertEquals(ProcessingStatus.PROCESSING, installationForm.getStatus().getEstimate());
  }

  @Test
  void should_ThrowException_When_InstallationFormNotFoundDuringCreation() {
    // Arrange
    when(ifRepo.findById(new InstallationFormId(formCode, formNumber))).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> costEstimateService.createEstimate(createRequest));
  }

  @Test
  void should_UpdateEstimate_When_Exists() {
    // Arrange
    when(eRepo.findById(estimateId)).thenReturn(Optional.of(costEstimate));
    when(owmSrv.isOverallMeterExisting("METER-123-UPDATED"))
      .thenReturn(new WrapperApiResponse(200, "Success", "true", OffsetDateTime.now()));
    when(owmSrv.isMeterExisting("SN123-UPDATED"))
      .thenReturn(true);
    when(eRepo.save(any(CostEstimate.class))).thenReturn(costEstimate);
    when(owmSrv.updateMaterialsOfCostEstimate(any(), any())).thenReturn(new WrapperApiResponse(200, "Success", null, OffsetDateTime.now()));
    when(owmSrv.getMaterialsOfCostEstimate(any())).thenReturn(Collections.emptyList());

    // Act
    var response = costEstimateService.updateEstimate(estimateId, updateRequest);

    // Assert
    assertNotNull(response);
    verify(eRepo).save(any(CostEstimate.class));
  }

  @Test
  void should_UpdateEstimate_WithImage_When_Provided() {
    // Arrange
    var image = new MockMultipartFile("designImage", "test.jpg", "image/jpeg", "test content".getBytes());
    var requestWithImage = new UpdateRequest(
      new UpdateRequest.GeneralInformation(
        "Name", "Addr", "Note", 100, 100, 1, 100, 1, 1, 1, 1, 1, 1, 100, image, "SN", "METER", null
      ),
      Collections.emptyList(),
      true
    );

    when(eRepo.findById(estimateId)).thenReturn(Optional.of(costEstimate));
    when(owmSrv.isOverallMeterExisting("METER"))
      .thenReturn(new WrapperApiResponse(200, "Success", "true", OffsetDateTime.now()));
    when(owmSrv.isMeterExisting("SN"))
      .thenReturn(true);
    when(gcsService.upload(image)).thenReturn("http://new-image.url");
    when(eRepo.save(any(CostEstimate.class))).thenReturn(costEstimate);
    when(owmSrv.updateMaterialsOfCostEstimate(any(), any())).thenReturn(new WrapperApiResponse(200, "Success", null, OffsetDateTime.now()));
    when(owmSrv.getMaterialsOfCostEstimate(any())).thenReturn(Collections.emptyList());

    // Act
    costEstimateService.updateEstimate(estimateId, requestWithImage);

    // Assert
    verify(gcsService).upload(image);
    verify(eRepo).save(any(CostEstimate.class));
  }

  @Test
  void should_ThrowException_When_UpdateEstimateNotFound() {
    // Arrange
    when(eRepo.findById(estimateId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> costEstimateService.updateEstimate(estimateId, updateRequest));
  }

  @Test
  void should_GetEstimateById_When_Found() {
    // Arrange
    when(eRepo.findById(estimateId)).thenReturn(Optional.of(costEstimate));
    when(owmSrv.getMaterialsOfCostEstimate(estimateId)).thenReturn(Collections.emptyList());

    // Act
    var response = costEstimateService.getEstimateById(estimateId);

    // Assert
    assertNotNull(response);
    assertEquals(costEstimate.getCustomerName(), response.generalInformation().customerName());
  }

  @Test
  void should_ThrowException_When_GetEstimateByIdNotFound() {
    // Arrange
    when(eRepo.findById(estimateId)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> costEstimateService.getEstimateById(estimateId));
  }

  @Test
  void should_GetAllEstimates_WithFilter() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    var filter = mock(EstimateFilterRequest.class);
    Page<CostEstimate> page = new PageImpl<>(List.of(costEstimate));

    when(eRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
    when(owmSrv.getMaterialsOfCostEstimate(any())).thenReturn(Collections.emptyList());

    // Act
    var response = costEstimateService.getAllEstimates(pageable, filter);

    // Assert
    assertNotNull(response);
    assertFalse(response.content().isEmpty());
  }

  @Test
  void should_GetAllEstimates_WithoutFilter() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    Page<CostEstimate> page = new PageImpl<>(List.of(costEstimate));

    when(eRepo.findAll(pageable)).thenReturn(page);
    when(owmSrv.getMaterialsOfCostEstimate(any())).thenReturn(Collections.emptyList());

    // Act
    var response = costEstimateService.getAllEstimates(pageable, null);

    // Assert
    assertNotNull(response);
    verify(eRepo).findAll(pageable);
  }
}
