package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.network.WaterSupplyNetworkService;
import com.capstone.construction.application.dto.request.branch.CreateRequest;
import com.capstone.construction.application.dto.request.branch.UpdateRequest;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WaterSupplyNetworkUseCaseTest {

  @Mock
  private WaterSupplyNetworkService networkService;

  @InjectMocks
  private WaterSupplyNetworkUseCase networkUseCase;

  @Test
  void should_CallServiceCreate_When_CreateNetwork() {
    // Given
    var request = new CreateRequest("Test Network");

    // When
    networkUseCase.createNetwork(request);

    // Then
    verify(networkService).createNetwork(request);
  }

  @Test
  void should_CallServiceUpdate_When_UpdateNetwork() {
    // Given
    var id = "id-1";
    var request = new UpdateRequest("Updated Network");
    var expectedResponse = new WaterSupplyNetworkResponse(id, "Updated Network",
        LocalDateTime.now());

    when(networkService.updateNetwork(id, request)).thenReturn(expectedResponse);

    // When
    var actualResponse = networkUseCase.updateNetwork(id, request);

    // Then
    assertThat(actualResponse).isNotNull();
    assertThat(actualResponse).isEqualTo(expectedResponse);
    verify(networkService).updateNetwork(id, request);
  }

  @Test
  void should_CallServiceDelete_When_DeleteNetwork() {
    // Given
    var id = "id-1";
    doNothing().when(networkService).deleteNetwork(id);

    // When
    networkUseCase.deleteNetwork(id);

    // Then
    verify(networkService).deleteNetwork(id);
  }

  @Test
  void should_CallServiceGetById_When_GetNetworkById() {
    // Given
    var id = "id-1";
    var expectedResponse = new WaterSupplyNetworkResponse(id, "Test Network",
        LocalDateTime.now());

    when(networkService.getNetworkById(id)).thenReturn(expectedResponse);

    // When
    var actualResponse = networkUseCase.getNetworkById(id);

    // Then
    assertThat(actualResponse).isNotNull();
    assertThat(actualResponse).isEqualTo(expectedResponse);
    verify(networkService).getNetworkById(id);
  }

  @Test
  void should_CallServiceGetAll_When_GetAllNetworks() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var keyword = "test";
    var expectedResponse = new PageResponse<WaterSupplyNetworkResponse>(
        Collections.emptyList(), 0, 10, 0, 0, true);

    when(networkService.getAllNetworks(pageable, keyword)).thenReturn(expectedResponse);

    // When
    var actualResponse = networkUseCase.getAllNetworks(pageable, keyword);

    // Then
    assertThat(actualResponse).isNotNull();
    assertThat(actualResponse).isEqualTo(expectedResponse);
    verify(networkService).getAllNetworks(pageable, keyword);
  }

  @Test
  void should_ThrowException_When_ServiceThrowsException() {
    // Given
    var id = "invalid-id";
    var expectedException = new RuntimeException("Not Found");
    doThrow(expectedException).when(networkService).deleteNetwork(id);

    // When & Then
    assertThatThrownBy(() -> networkUseCase.deleteNetwork(id))
        .isEqualTo(expectedException);
  }

  @Test
  void should_CallServiceCheckExists_When_CheckExistenceOfNetwork() {
    // Given
    var id = "id-1";
    when(networkService.networkExists(id)).thenReturn(true);

    // When
    var exists = networkUseCase.checkExistenceOfNetwork(id);

    // Then
    assertThat(exists).isTrue();
    verify(networkService).networkExists(id);
  }
}
