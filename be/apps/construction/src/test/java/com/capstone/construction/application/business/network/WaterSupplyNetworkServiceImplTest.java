package com.capstone.construction.application.business.network;

import com.capstone.construction.application.dto.request.branch.CreateRequest;
import com.capstone.construction.application.dto.request.branch.UpdateRequest;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
  void should_CreateNetwork_When_RequestIsValid() {
    // Given
    var networkName = "New Network";
    var request = new CreateRequest(networkName);
    var savedNetwork = new WaterSupplyNetwork("id-1", networkName, LocalDateTime.now(),
        LocalDateTime.now());

    when(networkRepository.save(any(WaterSupplyNetwork.class))).thenReturn(savedNetwork);

    // When
    networkService.createNetwork(request);

    // Then
    verify(networkRepository, times(1)).save(argThat(network -> network.getName().equals(networkName)));
  }

  @Test
  void should_ThrowException_When_CreateNameIsNull() {
    // Given
    var request = new CreateRequest(null);

    // When & Then
    assertThatThrownBy(() -> networkService.createNetwork(request))
        .isExactlyInstanceOf(NullPointerException.class);

    verify(networkRepository, never()).save(any());
  }

  @Test
  void should_ThrowException_When_CreateNameIsBlank() {
    // Given
    var request = new CreateRequest("   ");

    // When & Then
    assertThatThrownBy(() -> networkService.createNetwork(request))
        .isExactlyInstanceOf(IllegalArgumentException.class);

    verify(networkRepository, never()).save(any());
  }

  @Test
  void should_UpdateNetwork_When_NetworkExists() {
    // Given
    var id = "id-1";
    var oldName = "Old Name";
    var newName = "Updated Name";
    var request = new UpdateRequest(newName);

    var existingNetwork = new WaterSupplyNetwork(id, oldName, LocalDateTime.now(),
        LocalDateTime.now());
    var updatedNetwork = new WaterSupplyNetwork(id, newName, existingNetwork.getCreatedAt(),
        LocalDateTime.now());

    when(networkRepository.findById(id)).thenReturn(Optional.of(existingNetwork));
    when(networkRepository.existsByNameIgnoreCase(newName)).thenReturn(false);
    when(networkRepository.save(any(WaterSupplyNetwork.class))).thenReturn(updatedNetwork);

    // When
    var response = networkService.updateNetwork(id, request);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.name()).isEqualTo(newName);
    assertThat(response.branchId()).isEqualTo(id);

    verify(networkRepository, times(1)).findById(id);
    verify(networkRepository, times(1)).save(existingNetwork);
  }

  @Test
  void should_ThrowException_When_UpdateNameAlreadyExists() {
    // Given
    var id = "id-1";
    var existingName = "Existing Network";
    var request = new UpdateRequest(existingName);

    var currentNetwork = new WaterSupplyNetwork(id, "Other Name", LocalDateTime.now(),
        LocalDateTime.now());

    when(networkRepository.findById(id)).thenReturn(Optional.of(currentNetwork));
    when(networkRepository.existsByNameIgnoreCase(existingName)).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> networkService.updateNetwork(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class);

    verify(networkRepository, never()).save(any());
  }

  @Test
  void should_NotUpdateName_When_UpdateNameIsNull() {
    // Given
    var id = "id-1";
    var oldName = "Old Name";
    var request = new UpdateRequest(null);

    var existingNetwork = new WaterSupplyNetwork(id, oldName, LocalDateTime.now(),
        LocalDateTime.now());

    when(networkRepository.findById(id)).thenReturn(Optional.of(existingNetwork));
    when(networkRepository.save(any(WaterSupplyNetwork.class))).thenReturn(existingNetwork);

    // When
    var response = networkService.updateNetwork(id, request);

    // Then
    assertThat(response.name()).isEqualTo(oldName);
    verify(networkRepository).save(existingNetwork);
  }

  @Test
  void should_NotUpdateName_When_UpdateNameIsBlank() {
    // Given
    var id = "id-1";
    var oldName = "Old Name";
    var request = new UpdateRequest("  ");

    var existingNetwork = new WaterSupplyNetwork(id, oldName, LocalDateTime.now(),
        LocalDateTime.now());

    when(networkRepository.findById(id)).thenReturn(Optional.of(existingNetwork));
    when(networkRepository.save(any(WaterSupplyNetwork.class))).thenReturn(existingNetwork);

    // When
    var response = networkService.updateNetwork(id, request);

    // Then
    assertThat(response.name()).isEqualTo(oldName);
    verify(networkRepository).save(existingNetwork);
  }

  @Test
  void should_UpdateNetwork_When_NameIsSameIgnoreCase() {
    // Given
    var id = "id-1";
    var name = "Network Name";
    var request = new UpdateRequest(name.toLowerCase());

    var existingNetwork = new WaterSupplyNetwork(id, name, LocalDateTime.now(),
        LocalDateTime.now());

    when(networkRepository.findById(id)).thenReturn(Optional.of(existingNetwork));
    when(networkRepository.existsByNameIgnoreCase(name.toLowerCase())).thenReturn(true);
    when(networkRepository.save(any(WaterSupplyNetwork.class))).thenReturn(existingNetwork);

    // When
    var response = networkService.updateNetwork(id, request);

    // Then
    assertThat(response.name()).isEqualTo(name.toLowerCase());
  }

  @Test
  void should_ThrowException_When_UpdateNetworkNotFound() {
    // Given
    var id = "invalid-id";
    var request = new UpdateRequest("Any Name");

    when(networkRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> networkService.updateNetwork(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class);

    verify(networkRepository, never()).save(any());
  }

  @Test
  void should_DeleteNetwork_When_NetworkExists() {
    // Given
    var id = "id-1";
    when(networkRepository.existsById(id)).thenReturn(true);
    doNothing().when(networkRepository).deleteById(id);

    // When
    networkService.deleteNetwork(id);

    // Then
    verify(networkRepository, times(1)).existsById(id);
    verify(networkRepository, times(1)).deleteById(id);
  }

  @Test
  void should_ThrowException_When_DeleteNetworkNotFound() {
    // Given
    var id = "invalid-id";
    when(networkRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> networkService.deleteNetwork(id))
        .isExactlyInstanceOf(IllegalArgumentException.class);
    verify(networkRepository, never()).deleteById(any());
  }

  @Test
  void should_GetNetworkById_When_NetworkExists() {
    // Given
    var id = "id-1";
    var network = new WaterSupplyNetwork(id, "Network", LocalDateTime.now(), LocalDateTime.now());
    when(networkRepository.findById(id)).thenReturn(Optional.of(network));

    // When
    var response = networkService.getNetworkById(id);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.name()).isEqualTo(network.getName());
    assertThat(response.branchId()).isEqualTo(id);
  }

  @Test
  void should_ThrowException_When_GetNetworkByIdNotFound() {
    // Given
    var id = "invalid-id";
    when(networkRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> networkService.getNetworkById(id))
        .isExactlyInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void should_GetAllNetworks_When_NoKeyword() {
    // Given
    var pageable = PageRequest.of(0, 10);
    String keyword = null;
    var network = new WaterSupplyNetwork("id-1", "Network 1", LocalDateTime.now(),
        LocalDateTime.now());
    var page = new PageImpl<>(List.of(network));

    when(networkRepository.findAll(pageable)).thenReturn(page);

    // When
    var response = networkService.getAllNetworks(pageable, keyword);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.totalElements()).isEqualTo(1);
    assertThat(response.content().getFirst().name()).isEqualTo("Network 1");

    verify(networkRepository, times(1)).findAll(pageable);
    verify(networkRepository, never()).findAllByNameContainsIgnoreCase(anyString(), any(Pageable.class));
  }

  @Test
  void should_GetAllNetworks_When_KeywordProvided() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var keyword = "Test";
    var network = new WaterSupplyNetwork("id-1", "Test Network", LocalDateTime.now(),
        LocalDateTime.now());
    var page = new PageImpl<>(List.of(network));

    when(networkRepository.findAllByNameContainsIgnoreCase(keyword, pageable)).thenReturn(page);

    // When
    var response = networkService.getAllNetworks(pageable, keyword);

    // Then
    assertThat(response).isNotNull();
    assertThat(response.totalElements()).isEqualTo(1);
    assertThat(response.content().getFirst().name()).isEqualTo("Test Network");

    verify(networkRepository, times(1)).findAllByNameContainsIgnoreCase(keyword, pageable);
    verify(networkRepository, never()).findAll(pageable);
  }

  @Test
  void should_ReturnTrue_When_NetworkExists() {
    // Given
    var id = "id-1";
    when(networkRepository.existsById(id)).thenReturn(true);

    // When
    var result = networkService.networkExists(id);

    // Then
    assertThat(result).isTrue();
    verify(networkRepository).existsById(id);
  }

  @Test
  void should_ReturnFalse_When_NetworkDoesNotExist() {
    // Given
    var id = "invalid-id";
    when(networkRepository.existsById(id)).thenReturn(false);

    // When
    var result = networkService.networkExists(id);

    // Then
    assertThat(result).isFalse();
    verify(networkRepository).existsById(id);
  }
}
