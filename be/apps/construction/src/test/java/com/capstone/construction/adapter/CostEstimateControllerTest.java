package com.capstone.construction.adapter;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.usecase.estimate.CostEstimateUseCase;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    private CreateRequest createRequest;
    private UpdateRequest updateRequest;
    private CostEstimateResponse mockResponse;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(estimateController, "log", log);

        createRequest = new CreateRequest(
                "Customer", "Address", "Note", 1000, 100, 1, 1000, 1, 1, 1, 1, 1, 1, 100, "url",
                ProcessingStatus.PROCESSING, LocalDate.now(), "user", "SN", "METER", "CODE", "NUM"
        );

        updateRequest = new UpdateRequest(
                "Customer", "Address", "Note", 1000, 100, 1, 1000, 1, 1, 1, 1, 1, 1, 100, null, ProcessingStatus.PROCESSING, "SN", "METER"
        );

        mockResponse = new CostEstimateResponse(
                "id", "Customer", "Address", "Note", 1000, 100, 1, 1000, 1, 1, 1, 1, 1, 1, 100, "url",
                LocalDateTime.now(), LocalDateTime.now(), ProcessingStatus.PROCESSING, LocalDate.now(), "user", "SN", "METER",
                new InstallationFormId("CODE", "NUM")
        );
    }

    @Test
    void should_ReturnCreated_When_CreateEstimate() {
        // Arrange
        when(estimateUseCase.createEstimate(any(CreateRequest.class))).thenReturn(mockResponse);

        // Act
        var responseEntity = estimateController.createEstimate(createRequest);

        // Assert
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(responseEntity.getBody()).isNotNull();
        assertThat(responseEntity.getBody().message()).isEqualTo("Tạo dự toán chi phí thành công");
        verify(estimateUseCase).createEstimate(createRequest);
    }

    @Test
    void should_ReturnOk_When_UpdateEstimate() {
        // Arrange
        String id = "id-123";
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
        String id = "id-123";
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
        Pageable pageable = PageRequest.of(0, 10);
        BaseFilterRequest filter = new BaseFilterRequest(null, null, null);
        
        // Act
        var responseEntity = estimateController.getAllEstimates(pageable, filter);

        // Assert
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(estimateUseCase).getAllEstimates(pageable, filter);
    }
}
