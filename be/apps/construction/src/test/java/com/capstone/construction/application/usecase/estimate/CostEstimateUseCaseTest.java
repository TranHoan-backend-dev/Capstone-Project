package com.capstone.construction.application.usecase.estimate;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.exception.NotExistingException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.service.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CostEstimateUseCaseTest {

    @Mock
    private CostEstimateService estSrv;

    @Mock
    private EmployeeService empSrv;

    @Mock
    private MessageProducer messageProducer;

    @Mock
    private InstallationFormService ifSrv;

    @InjectMocks
    private CostEstimateUseCase costEstimateUseCase;

    private CreateRequest createRequest;
    private UpdateRequest updateRequest;
    private CostEstimateResponse mockResponse;
    private String formCode = "FOR-001";
    private String formNumber = "NUM-001";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(costEstimateUseCase, "PREFIX", ".PREFIX.");
        ReflectionTestUtils.setField(costEstimateUseCase, "CREATE_ACTION", "CREATE");
        ReflectionTestUtils.setField(costEstimateUseCase, "UPDATE_ACTION", "UPDATE");
        ReflectionTestUtils.setField(costEstimateUseCase, "QUEUE_NAME", "QUEUE");

        createRequest = new CreateRequest(
                "Customer Name", "Address", "Note", 1000, 500, 1, 2000, 10, 5, 10, 5, 10, 2, 100, "url",
                ProcessingStatus.PROCESSING, LocalDate.now(), "user-123", "SN123", "METER-123", formCode, formNumber
        );

        updateRequest = new UpdateRequest(
                "Name", "Addr", "Note", 100, 100, 1, 100, 1, 1, 1, 1, 1, 1, 100, null, ProcessingStatus.PROCESSING, "SN", "METER"
        );

        mockResponse = new CostEstimateResponse(
                "id-123", "Customer Name", "Address", "Note", 1000, 500, 1, 2000, 10, 5, 10, 5, 10, 2, 100, "url",
                LocalDateTime.now(), LocalDateTime.now(), ProcessingStatus.PROCESSING, LocalDate.now(), "user-123", "SN123", "METER-123",
                new InstallationFormId(formCode, formNumber)
        );
    }

    @Test
    void should_CreateEstimate_When_InstallationFormExists() {
        // Arrange
        when(ifSrv.isInstallationFormExisting(formNumber, formCode)).thenReturn(true);
        when(estSrv.createEstimate(createRequest)).thenReturn(mockResponse);
        when(empSrv.getEmployeeNameById(anyString())).thenReturn(new WrapperApiResponse("Created By Employee", "data"));

        // Act
        CostEstimateResponse response = costEstimateUseCase.createEstimate(createRequest);

        // Assert
        assertNotNull(response);
        verify(estSrv).createEstimate(createRequest);
        verify(messageProducer).send(anyString(), any());
    }

    @Test
    void should_ThrowException_When_InstallationFormDoesNotExist() {
        // Arrange
        when(ifSrv.isInstallationFormExisting(formNumber, formCode)).thenReturn(false);

        // Act & Assert
        assertThrows(NotExistingException.class, () -> costEstimateUseCase.createEstimate(createRequest));
        verify(estSrv, never()).createEstimate(any());
    }

    @Test
    void should_UpdateEstimate_Success() {
        // Arrange
        when(estSrv.updateEstimate(anyString(), any(UpdateRequest.class))).thenReturn(mockResponse);
        when(empSrv.getEmployeeNameById(anyString())).thenReturn(new WrapperApiResponse("Updated By Employee", "data"));

        // Act
        CostEstimateResponse response = costEstimateUseCase.updateEstimate("id-123", updateRequest);

        // Assert
        assertNotNull(response);
        verify(estSrv).updateEstimate("id-123", updateRequest);
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
        costEstimateUseCase.getAllEstimates(null, null);

        // Assert
        verify(estSrv).getAllEstimates(null, null);
    }
}
