package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.network.WaterSupplyNetworkService;
import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WaterSupplyNetworkUseCaseTest {

  @Mock
  private WaterSupplyNetworkService networkService;

  @InjectMocks
  private WaterSupplyNetworkUseCase networkUseCase;

  @Test
  @DisplayName("should_CallServiceCreate_When_CreateNetwork")
  void should_CallServiceCreate_When_CreateNetwork() {
    // Arrange
    var request = new WaterSupplyNetworkRequest("Test Network");
    var expectedResponse = new WaterSupplyNetworkResponse("id-1", "Test Network",
      LocalDateTime.now());

    when(networkService.createNetwork(request)).thenReturn(expectedResponse);

    // Act
    var actualResponse = networkUseCase.createNetwork(request);

    // Assert
    assertNotNull(actualResponse);
    assertEquals(expectedResponse, actualResponse);
    verify(networkService, times(1)).createNetwork(request);
  }

  @Test
  @DisplayName("should_CallServiceUpdate_When_UpdateNetwork")
  void should_CallServiceUpdate_When_UpdateNetwork() {
    // Arrange
    var id = "id-1";
    var request = new WaterSupplyNetworkRequest("Updated Network");
    var expectedResponse = new WaterSupplyNetworkResponse(id, "Updated Network",
      LocalDateTime.now());

    when(networkService.updateNetwork(id, request)).thenReturn(expectedResponse);

    // Act
    var actualResponse = networkUseCase.updateNetwork(id, request);

    // Assert
    assertNotNull(actualResponse);
    assertEquals(expectedResponse, actualResponse);
    verify(networkService, times(1)).updateNetwork(id, request);
  }

  @Test
  @DisplayName("should_CallServiceDelete_When_DeleteNetwork")
  void should_CallServiceDelete_When_DeleteNetwork() {
    // Arrange
    var id = "id-1";
    doNothing().when(networkService).deleteNetwork(id);

    // Act
    networkUseCase.deleteNetwork(id);

    // Assert
    verify(networkService, times(1)).deleteNetwork(id);
  }

  @Test
  @DisplayName("should_CallServiceGetById_When_GetNetworkById")
  void should_CallServiceGetById_When_GetNetworkById() {
    // Arrange
    var id = "id-1";
    var expectedResponse = new WaterSupplyNetworkResponse(id, "Test Network",
      LocalDateTime.now());

    when(networkService.getNetworkById(id)).thenReturn(expectedResponse);

    // Act
    var actualResponse = networkUseCase.getNetworkById(id);

    // Assert
    assertNotNull(actualResponse);
    assertEquals(expectedResponse, actualResponse);
    verify(networkService, times(1)).getNetworkById(id);
  }

  @Test
  @DisplayName("should_CallServiceGetAll_When_GetAllNetworks")
  void should_CallServiceGetAll_When_GetAllNetworks() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    var keyword = "test";
    PageResponse<WaterSupplyNetworkResponse> expectedResponse = new PageResponse<>(
      Collections.emptyList(), 0, 10, 0, 0, true);

    when(networkService.getAllNetworks(pageable, keyword)).thenReturn(expectedResponse);

    // Act
    PageResponse<WaterSupplyNetworkResponse> actualResponse = networkUseCase.getAllNetworks(pageable, keyword);

    // Assert
    assertNotNull(actualResponse);
    assertEquals(expectedResponse, actualResponse);
    verify(networkService, times(1)).getAllNetworks(pageable, keyword);
  }

  @Test
  @DisplayName("should_ThrowException_When_ServiceThrowsException")
  void should_ThrowException_When_ServiceThrowsException() {
    // Arrange
    var id = "invalid-id";
    var expectedException = new RuntimeException("Not Found");
    doThrow(expectedException).when(networkService).deleteNetwork(id);

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class, () -> networkUseCase.deleteNetwork(id));
    assertEquals(expectedException, exception);
  }
}
