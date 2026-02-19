package com.capstone.construction.application.business.network;

import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WaterSupplyNetworkServiceImplTest {

  @Mock
  private WaterSupplyNetworkRepository networkRepository;

  @Mock
  private Logger log;

  @InjectMocks
  private WaterSupplyNetworkServiceImpl networkService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(networkService, "log", log);
  }

  @Test
  @DisplayName("should_CreateNetwork_When_RequestIsValid")
  void should_CreateNetwork_When_RequestIsValid() {
    // Arrange
    var networkName = "New Network";
    var request = new WaterSupplyNetworkRequest(networkName);

    var savedNetwork = new WaterSupplyNetwork("id-1", networkName, LocalDateTime.now(),
      LocalDateTime.now());

    when(networkRepository.save(any(WaterSupplyNetwork.class))).thenReturn(savedNetwork);

    // Act
    var response = networkService.createNetwork(request);

    // Assert
    assertNotNull(response);
    assertEquals(networkName, response.name());
    assertEquals("id-1", response.branchId());
    verify(networkRepository, times(1)).save(any(WaterSupplyNetwork.class));
  }

  @Test
  @DisplayName("should_UpdateNetwork_When_NetworkExists")
  void should_UpdateNetwork_When_NetworkExists() {
    // Arrange
    var id = "id-1";
    var oldName = "Old Name";
    var newName = "Updated Name";
    var request = new WaterSupplyNetworkRequest(newName);

    var existingNetwork = new WaterSupplyNetwork(id, oldName, LocalDateTime.now(),
      LocalDateTime.now());
    var updatedNetwork = new WaterSupplyNetwork(id, newName, existingNetwork.getCreatedAt(),
      LocalDateTime.now());

    when(networkRepository.findById(id)).thenReturn(Optional.of(existingNetwork));
    when(networkRepository.save(any(WaterSupplyNetwork.class))).thenReturn(updatedNetwork);

    // Act
    var response = networkService.updateNetwork(id, request);

    // Assert
    assertNotNull(response);
    assertEquals(newName, response.name());
    assertEquals(id, response.branchId());

    verify(networkRepository, times(1)).findById(id);
    verify(networkRepository, times(1)).save(existingNetwork);
  }

  @Test
  @DisplayName("should_ThrowException_When_UpdateNetworkNotFound")
  void should_ThrowException_When_UpdateNetworkNotFound() {
    // Arrange
    var id = "invalid-id";
    var request = new WaterSupplyNetworkRequest("Any Name");

    when(networkRepository.findById(id)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> networkService.updateNetwork(id, request));
    verify(networkRepository, never()).save(any());
  }

  @Test
  @DisplayName("should_DeleteNetwork_When_NetworkExists")
  void should_DeleteNetwork_When_NetworkExists() {
    // Arrange
    var id = "id-1";
    when(networkRepository.existsById(id)).thenReturn(true);
    doNothing().when(networkRepository).deleteById(id);

    // Act
    networkService.deleteNetwork(id);

    // Assert
    verify(networkRepository, times(1)).existsById(id);
    verify(networkRepository, times(1)).deleteById(id);
  }

  @Test
  @DisplayName("should_ThrowException_When_DeleteNetworkNotFound")
  void should_ThrowException_When_DeleteNetworkNotFound() {
    // Arrange
    var id = "invalid-id";
    when(networkRepository.existsById(id)).thenReturn(false);

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> networkService.deleteNetwork(id));
    verify(networkRepository, never()).deleteById(any());
  }

  @Test
  @DisplayName("should_GetNetworkById_When_NetworkExists")
  void should_GetNetworkById_When_NetworkExists() {
    // Arrange
    var id = "id-1";
    var network = new WaterSupplyNetwork(id, "Network", LocalDateTime.now(), LocalDateTime.now());
    when(networkRepository.findById(id)).thenReturn(Optional.of(network));

    // Act
    var response = networkService.getNetworkById(id);

    // Assert
    assertNotNull(response);
    assertEquals(network.getName(), response.name());
    assertEquals(id, response.branchId());
  }

  @Test
  @DisplayName("should_ThrowException_When_GetNetworkByIdNotFound")
  void should_ThrowException_When_GetNetworkByIdNotFound() {
    // Arrange
    var id = "invalid-id";
    when(networkRepository.findById(id)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(IllegalArgumentException.class, () -> networkService.getNetworkById(id));
  }

  @Test
  @DisplayName("should_GetAllNetworks_When_NoKeyword")
  void should_GetAllNetworks_When_NoKeyword() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    String keyword = null;
    var network = new WaterSupplyNetwork("id-1", "Network 1", LocalDateTime.now(),
      LocalDateTime.now());
    Page<WaterSupplyNetwork> page = new PageImpl<>(List.of(network));

    when(networkRepository.findAll(pageable)).thenReturn(page);

    // Act
    PageResponse<WaterSupplyNetworkResponse> response = networkService.getAllNetworks(pageable, keyword);

    // Assert
    assertNotNull(response);
    assertEquals(1, response.totalElements());
    assertEquals("Network 1", response.content().getFirst().name());
    verify(networkRepository, times(1)).findAll(pageable);
    verify(networkRepository, never()).findAllByNameContainsIgnoreCase(anyString(), any(Pageable.class));
  }

  @Test
  @DisplayName("should_GetAllNetworks_When_KeywordProvided")
  void should_GetAllNetworks_When_KeywordProvided() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    var keyword = "Test";
    var network = new WaterSupplyNetwork("id-1", "Test Network", LocalDateTime.now(),
      LocalDateTime.now());
    Page<WaterSupplyNetwork> page = new PageImpl<>(List.of(network));

    when(networkRepository.findAllByNameContainsIgnoreCase(keyword, pageable)).thenReturn(page);

    // Act
    PageResponse<WaterSupplyNetworkResponse> response = networkService.getAllNetworks(pageable, keyword);

    // Assert
    assertNotNull(response);
    assertEquals(1, response.totalElements());
    assertEquals("Test Network", response.content().get(0).name());
    verify(networkRepository, times(1)).findAllByNameContainsIgnoreCase(keyword, pageable);
    verify(networkRepository, never()).findAll(pageable);
  }
}
