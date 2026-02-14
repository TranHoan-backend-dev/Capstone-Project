package com.capstone.construction.adapter.catalog;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.usecase.catalog.WaterSupplyNetworkUseCase;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WaterSupplyNetworkControllerTest {

    @Mock
    private WaterSupplyNetworkUseCase networkUseCase;

    @InjectMocks
    private WaterSupplyNetworkController networkController;

    @Test
    @DisplayName("should_ReturnCreated_When_RequestIsValid")
    void should_ReturnCreated_When_RequestIsValid() {
        // Arrange
        var request = new WaterSupplyNetworkRequest("Trạm bơm số 1");
        var expectedResponse = new WaterSupplyNetworkResponse("uuid-123", "Trạm bơm số 1",
                LocalDateTime.now());

        when(networkUseCase.createNetwork(any(WaterSupplyNetworkRequest.class))).thenReturn(expectedResponse);

        // Act
        ResponseEntity<WrapperApiResponse> responseEntity = networkController.createNetwork(request);

        // Assert
        assertNotNull(responseEntity);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertEquals(HttpStatus.CREATED.value(), responseEntity.getBody().status());
        assertEquals("Tạo mạng lưới cấp nước thành công", responseEntity.getBody().message());
        assertEquals(expectedResponse, responseEntity.getBody().data());

        verify(networkUseCase, times(1)).createNetwork(request);
    }

    @Test
    @DisplayName("should_ThrowException_When_UseCaseThrowsException")
    void should_ThrowException_When_UseCaseThrowsException() {
        // Arrange
        var request = new WaterSupplyNetworkRequest("Trạm bơm số 1");
        var expectedException = new RuntimeException("Unexpected Error");

        doThrow(expectedException).when(networkUseCase).createNetwork(any(WaterSupplyNetworkRequest.class));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            networkController.createNetwork(request);
        });

        assertEquals(expectedException, exception);
        verify(networkUseCase, times(1)).createNetwork(request);
    }
}
