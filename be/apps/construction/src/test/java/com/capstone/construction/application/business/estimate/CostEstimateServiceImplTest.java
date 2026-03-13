package com.capstone.construction.application.business.estimate;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.FormProcessingStatus;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.service.GcsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @InjectMocks
    private CostEstimateServiceImpl costEstimateService;

    private CreateRequest createRequest;
    private UpdateRequest updateRequest;
    private CostEstimate costEstimate;
    private InstallationForm installationForm;
    private String estimateId = "estimate-123";
    private String formCode = "FOR-001";
    private String formNumber = "NUM-001";

    @BeforeEach
    void setUp() {
        createRequest = new CreateRequest(
                "Customer Name",
                "Address",
                "Note",
                1000,
                500,
                1,
                2000,
                10,
                5,
                10,
                5,
                10,
                2,
                100,
                "http://image.url",
                ProcessingStatus.PROCESSING,
                LocalDate.now(),
                "user-123",
                "SN123",
                "METER-123",
                formCode,
                formNumber
        );

        updateRequest = new UpdateRequest(
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
                ProcessingStatus.COMPLETED,
                "SN123-UPDATED",
                "METER-123-UPDATED"
        );

        costEstimate = CostEstimate.create(b -> b
                .customerName(createRequest.customerName())
                .address(createRequest.address())
                .contractFee(createRequest.contractFee())
                .surveyFee(createRequest.surveyFee())
                .surveyEffort(createRequest.surveyEffort())
                .installationFee(createRequest.installationFee())
                .laborCoefficient(createRequest.laborCoefficient())
                .generalCostCoefficient(createRequest.generalCostCoefficient())
                .precalculatedTaxCoefficient(createRequest.precalculatedTaxCoefficient())
                .constructionMachineryCoefficient(createRequest.constructionMachineryCoefficient())
                .vatCoefficient(createRequest.vatCoefficient())
                .designCoefficient(createRequest.designCoefficient())
                .designFee(createRequest.designFee())
                .designImageUrl(createRequest.designImageUrl())
                .status(createRequest.status())
                .registrationAt(createRequest.registrationAt())
                .createBy(createRequest.createBy())
                .waterMeterSerial(createRequest.waterMeterSerial())
                .overallWaterMeterId(createRequest.overallWaterMeterId())
                .installationFormId(new InstallationFormId(formCode, formNumber))
        );
        // Reflection or setter to set ID if needed, but here we mock saved object
    }

    @Test
    void should_CreateEstimate_When_ValidRequest() {
        // Arrange
        installationForm = new InstallationForm();
        installationForm.setStatus(new FormProcessingStatus(ProcessingStatus.PROCESSING, ProcessingStatus.PENDING_FOR_APPROVAL, ProcessingStatus.PENDING_FOR_APPROVAL, ProcessingStatus.PENDING_FOR_APPROVAL));
        
        when(eRepo.save(any(CostEstimate.class))).thenReturn(costEstimate);
        when(ifRepo.findById_FormCodeAndId_FormNumber(formCode, formNumber)).thenReturn(Optional.of(installationForm));

        // Act
        CostEstimateResponse response = costEstimateService.createEstimate(createRequest);

        // Assert
        assertNotNull(response);
        assertEquals(createRequest.customerName(), response.customerName());
        verify(eRepo).save(any(CostEstimate.class));
        verify(ifRepo).save(any(InstallationForm.class));
        assertEquals(ProcessingStatus.PROCESSING, installationForm.getStatus().getEstimate());
    }

    @Test
    void should_ThrowException_When_InstallationFormNotFoundDuringCreation() {
        // Arrange
        when(eRepo.save(any(CostEstimate.class))).thenReturn(costEstimate);
        when(ifRepo.findById_FormCodeAndId_FormNumber(formCode, formNumber)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> costEstimateService.createEstimate(createRequest));
    }

    @Test
    void should_UpdateEstimate_When_Exists() {
        // Arrange
        when(eRepo.findById(estimateId)).thenReturn(Optional.of(costEstimate));
        when(eRepo.save(any(CostEstimate.class))).thenReturn(costEstimate);

        // Act
        CostEstimateResponse response = costEstimateService.updateEstimate(estimateId, updateRequest);

        // Assert
        assertNotNull(response);
        verify(eRepo).save(any(CostEstimate.class));
    }

    @Test
    void should_UpdateEstimate_WithImage_When_Provided() {
        // Arrange
        MockMultipartFile image = new MockMultipartFile("designImage", "test.jpg", "image/jpeg", "test content".getBytes());
        UpdateRequest requestWithImage = new UpdateRequest(
                "Name", "Addr", "Note", 100, 100, 1, 100, 1, 1, 1, 1, 1, 1, 100, image, ProcessingStatus.PROCESSING, "SN", "METER"
        );
        
        when(eRepo.findById(estimateId)).thenReturn(Optional.of(costEstimate));
        when(gcsService.upload(image)).thenReturn("http://new-image.url");
        when(eRepo.save(any(CostEstimate.class))).thenReturn(costEstimate);

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

        // Act
        CostEstimateResponse response = costEstimateService.getEstimateById(estimateId);

        // Assert
        assertNotNull(response);
        assertEquals(costEstimate.getCustomerName(), response.customerName());
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
        Pageable pageable = PageRequest.of(0, 10);
        BaseFilterRequest filter = new BaseFilterRequest("Keyword", "01-01-2023", "31-12-2023");
        Page<CostEstimate> page = new PageImpl<>(List.of(costEstimate));
        
        when(eRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

        // Act
        var response = costEstimateService.getAllEstimates(pageable, filter);

        // Assert
        assertNotNull(response);
        assertFalse(response.data().isEmpty());
    }

    @Test
    void should_GetAllEstimates_WithoutFilter() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<CostEstimate> page = new PageImpl<>(List.of(costEstimate));
        
        when(eRepo.findAll(pageable)).thenReturn(page);

        // Act
        var response = costEstimateService.getAllEstimates(pageable, null);

        // Assert
        assertNotNull(response);
        verify(eRepo).findAll(pageable);
    }
}
