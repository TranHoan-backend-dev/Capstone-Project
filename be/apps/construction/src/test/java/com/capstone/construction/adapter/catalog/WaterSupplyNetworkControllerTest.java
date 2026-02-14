package com.capstone.construction.adapter.catalog;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.usecase.catalog.WaterSupplyNetworkUseCase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

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

  @Mock
  private Logger log;

  @InjectMocks
  private WaterSupplyNetworkController networkController;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(networkController, "log", log);
  }

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
    assertEquals("Network created successfully", responseEntity.getBody().message());
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

  @Test
  @DisplayName("should_ReturnOk_When_GetAllNetworksWithPaginationAndKeyword")
  void should_ReturnOk_When_GetAllNetworksWithPaginationAndKeyword() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    var keyword = "test";
    List<WaterSupplyNetworkResponse> networkList = List.of(
      new WaterSupplyNetworkResponse("uuid-1", "Network 1", LocalDateTime.now()),
      new WaterSupplyNetworkResponse("uuid-2", "Network 2", LocalDateTime.now()));
    PageResponse<WaterSupplyNetworkResponse> expectedResponse = new PageResponse<>(
      networkList, 0, 10, 2, 1, true);

    when(networkUseCase.getAllNetworks(pageable, keyword)).thenReturn(expectedResponse);

    // Act
    ResponseEntity<WrapperApiResponse> responseEntity = networkController.getAllNetworks(pageable, keyword);

    // Assert
    assertNotNull(responseEntity);
    assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    assertNotNull(responseEntity.getBody());
    assertEquals(HttpStatus.OK.value(), responseEntity.getBody().status());
    assertEquals("Lấy danh sách mạng lưới thành công", responseEntity.getBody().message());
    assertEquals(expectedResponse, responseEntity.getBody().data());

    verify(networkUseCase, times(1)).getAllNetworks(pageable, keyword);
  }

  @Test
  @DisplayName("should_ReturnOk_When_GetAllNetworksWithPaginationOnly")
  void should_ReturnOk_When_GetAllNetworksWithPaginationOnly() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    String keyword = null;
    List<WaterSupplyNetworkResponse> networkList = Collections.emptyList();
    PageResponse<WaterSupplyNetworkResponse> expectedResponse = new PageResponse<>(
      networkList, 0, 10, 0, 0, true);

    when(networkUseCase.getAllNetworks(pageable, keyword)).thenReturn(expectedResponse);

    // Act
    ResponseEntity<WrapperApiResponse> responseEntity = networkController.getAllNetworks(pageable, keyword);

    // Assert
    assertNotNull(responseEntity);
    assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
    assertNotNull(responseEntity.getBody());
    assertEquals(expectedResponse, responseEntity.getBody().data());

    verify(networkUseCase, times(1)).getAllNetworks(pageable, keyword);
  }

  @Test
  @DisplayName("should_ThrowException_When_GetAllNetworksUseCaseThrowsException")
  void should_ThrowException_When_GetAllNetworksUseCaseThrowsException() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    var keyword = "error";
    var expectedException = new RuntimeException("DB Error");

    doThrow(expectedException).when(networkUseCase).getAllNetworks(pageable, keyword);

    // Act & Assert
    RuntimeException exception = assertThrows(RuntimeException.class, () -> {
      networkController.getAllNetworks(pageable, keyword);
    });

    assertEquals(expectedException, exception);
    verify(networkUseCase, times(1)).getAllNetworks(pageable, keyword);
  }
}
