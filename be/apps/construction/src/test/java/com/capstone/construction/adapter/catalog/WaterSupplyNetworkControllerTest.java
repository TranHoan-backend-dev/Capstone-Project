package com.capstone.construction.adapter.catalog;

import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.usecase.catalog.WaterSupplyNetworkUseCase;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
  void should_ReturnCreated_When_CreateRequestIsValid() {
    // Given
    var request = new WaterSupplyNetworkRequest("Trạm bơm số 1");

    // When
    var responseEntity = networkController.createNetwork(request);

    // Then
    assertThat(responseEntity).isNotNull();
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.CREATED);

    var body = responseEntity.getBody();
    assertThat(body).isNotNull();
    assertThat(body.status()).isEqualTo(201);
    assertThat(body.message()).isEqualTo("Network created successfully");
    assertThat(body.data()).isNull();

    verify(networkUseCase).createNetwork(request);
  }

  @Test
  void should_ThrowException_When_CreateUseCaseThrowsException() {
    // Given
    var request = new WaterSupplyNetworkRequest("Trạm bơm số 1");
    var expectedException = new RuntimeException("Unexpected Error");

    doThrow(expectedException).when(networkUseCase).createNetwork(any(WaterSupplyNetworkRequest.class));

    // When & Then
    assertThatThrownBy(() -> networkController.createNetwork(request))
        .isExactlyInstanceOf(RuntimeException.class)
        .hasMessage("Unexpected Error");

    verify(networkUseCase).createNetwork(request);
  }

  @Test
  void should_ReturnOk_When_UpdateIsSuccessful() {
    // Given
    var id = "uuid-1";
    var request = new WaterSupplyNetworkRequest("Updated Name");
    var expectedResponse = new WaterSupplyNetworkResponse(id, "Updated Name", LocalDateTime.now());

    when(networkUseCase.updateNetwork(id, request)).thenReturn(expectedResponse);

    // When
    var responseEntity = networkController.updateNetwork(id, request);

    // Then
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

    var body = responseEntity.getBody();
    assertThat(body).isNotNull();
    assertThat(body.data()).isEqualTo(expectedResponse);
    verify(networkUseCase).updateNetwork(id, request);
  }

  @Test
  void should_ReturnOk_When_DeleteIsSuccessful() {
    // Given
    var id = "uuid-1";

    // When
    var responseEntity = networkController.deleteNetwork(id);

    // Then
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

    var body = responseEntity.getBody();
    assertThat(body).isNotNull();
    assertThat(body.message()).isEqualTo("Network deleted successfully");
    verify(networkUseCase).deleteNetwork(id);
  }

  @Test
  void should_ReturnOk_When_GetByIdIsSuccessful() {
    // Given
    var id = "uuid-1";
    var expectedResponse = new WaterSupplyNetworkResponse(id, "Network 1", LocalDateTime.now());

    when(networkUseCase.getNetworkById(id)).thenReturn(expectedResponse);

    // When
    var responseEntity = networkController.getNetworkById(id);

    // Then
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

    var body = responseEntity.getBody();
    assertThat(body).isNotNull();
    assertThat(body.data()).isEqualTo(expectedResponse);
    verify(networkUseCase).getNetworkById(id);
  }

  @Test
  void should_ReturnOk_When_GetAllNetworksWithPaginationAndKeyword() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var keyword = "test";
    var networkList = List.of(
        new WaterSupplyNetworkResponse("uuid-1", "Network 1", LocalDateTime.now()),
        new WaterSupplyNetworkResponse("uuid-2", "Network 2", LocalDateTime.now()));
    var expectedResponse = new PageResponse<>(
        networkList, 0, 10, 2, 1, true);

    when(networkUseCase.getAllNetworks(pageable, keyword)).thenReturn(expectedResponse);

    // When
    var responseEntity = networkController.getAllNetworks(pageable, keyword);

    // Then
    assertThat(responseEntity).isNotNull();
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

    var body = responseEntity.getBody();
    assertThat(body).isNotNull();
    assertThat(body.status()).isEqualTo(200);
    assertThat(body.message()).isEqualTo("Lấy danh sách mạng lưới thành công");
    assertThat(body.data()).isEqualTo(expectedResponse);

    verify(networkUseCase).getAllNetworks(pageable, keyword);
  }

  @Test
  void should_ReturnOk_When_GetAllNetworksWithPaginationOnly() {
    // Given
    var pageable = PageRequest.of(0, 10);
    String keyword = null;
    var expectedResponse = new PageResponse<WaterSupplyNetworkResponse>(
        Collections.emptyList(), 0, 10, 0, 0, true);

    when(networkUseCase.getAllNetworks(pageable, keyword)).thenReturn(expectedResponse);

    // When
    var responseEntity = networkController.getAllNetworks(pageable, keyword);

    // Then
    assertThat(responseEntity).isNotNull();
    assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);

    var body = responseEntity.getBody();
    assertThat(body).isNotNull();
    assertThat(body.data()).isEqualTo(expectedResponse);

    verify(networkUseCase).getAllNetworks(pageable, keyword);
  }

  @Test
  void should_ThrowException_When_GetAllNetworksUseCaseThrowsException() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var keyword = "error";
    var expectedException = new RuntimeException("DB Error");

    doThrow(expectedException).when(networkUseCase).getAllNetworks(pageable, keyword);

    // When & Then
    assertThatThrownBy(() -> networkController.getAllNetworks(pageable, keyword))
        .isExactlyInstanceOf(RuntimeException.class);

    verify(networkUseCase).getAllNetworks(pageable, keyword);
  }

  @Test
  void should_ReturnBoolean_When_CheckExistence() {
    // Given
    var id = "uuid-1";
    when(networkUseCase.checkExistenceOfNetwork(id)).thenReturn(true);

    // When
    var result = networkController.checkExistence(id);

    // Then
    assertThat(result).isTrue();
    verify(networkUseCase).checkExistenceOfNetwork(id);
  }
}
