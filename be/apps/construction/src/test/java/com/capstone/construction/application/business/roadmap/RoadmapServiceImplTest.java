package com.capstone.construction.application.business.roadmap;

import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.domain.model.Lateral;
import com.capstone.construction.domain.model.Roadmap;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.infrastructure.persistence.LateralRepository;
import com.capstone.construction.infrastructure.persistence.RoadmapRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoadmapServiceImplTest {

  @Mock
  RoadmapRepository roadmapRepository;
  @Mock
  LateralRepository lateralRepository;
  @Mock
  WaterSupplyNetworkRepository networkRepository;

  @InjectMocks
  RoadmapServiceImpl roadmapService;

  @Test
  void createRoadmap_should_Create_When_RequestIsValid() {
    // Given
    var request = new RoadmapRequest("Roadmap Test", "lateral-id", "network-id");
    var lateral = new Lateral("lateral-id", "Lateral Name", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("network-id", "Network Name", LocalDateTime.now(), LocalDateTime.now());

    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(lateralRepository.findById(request.lateralId())).thenReturn(Optional.of(lateral));
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.of(network));

    when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(invocation -> {
      var r = invocation.getArgument(0);
      setField(r, "roadmapId", "roadmap-id");
      setField(r, "createdAt", LocalDateTime.now());
      setField(r, "updatedAt", LocalDateTime.now());
      return r;
    });

    // When
    var response = roadmapService.createRoadmap(request);

    // Then
    assertThat(response.name()).isEqualTo("Roadmap Test");
    assertThat(response.lateralId()).isEqualTo("lateral-id");
    assertThat(response.networkId()).isEqualTo("network-id");
    verify(roadmapRepository).save(any(Roadmap.class));
  }

  @Test
  void createRoadmap_should_ThrowException_When_NameExists() {
    // Given
    var request = new RoadmapRequest("Roadmap Test", "lateral-id", "network-id");
    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> roadmapService.createRoadmap(request))
      .isInstanceOf(ExistingItemException.class)
      .hasMessageContaining("already exists");

    verify(roadmapRepository, never()).save(any(Roadmap.class));
  }

  @Test
  void createRoadmap_should_ThrowException_When_LateralNotFound() {
    // Given
    var request = new RoadmapRequest("Roadmap Test", "lateral-id", "network-id");
    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(lateralRepository.findById(request.lateralId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.createRoadmap(request))
      .isInstanceOf(IllegalArgumentException.class);

    verify(roadmapRepository, never()).save(any(Roadmap.class));
  }

  @Test
  void createRoadmap_should_ThrowException_When_NetworkNotFound() {
    // Given
    var request = new RoadmapRequest("Roadmap Test", "lateral-id", "network-id");
    var lateral = new Lateral("lateral-id", "Lateral Name", null, LocalDateTime.now(), LocalDateTime.now());

    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(lateralRepository.findById(request.lateralId())).thenReturn(Optional.of(lateral));
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.createRoadmap(request))
      .isInstanceOf(IllegalArgumentException.class);

    verify(roadmapRepository, never()).save(any(Roadmap.class));
  }

  @Test
  void createRoadmap_should_ThrowException_When_NameIsNull() {
    // Given
    var request = new RoadmapRequest(null, "lateral-id", "network-id");

    // When & Then
    assertThatThrownBy(() -> roadmapService.createRoadmap(request))
      .isInstanceOf(NullPointerException.class);

    verify(roadmapRepository, never()).save(any(Roadmap.class));
  }

  @Test
  void updateRoadmap_should_Update_When_RequestIsValid() {
    // Given
    var id = "roadmap-id";
    var request = new RoadmapRequest("Roadmap Updated", "new-lateral-id", "new-network-id");
    var lateral = new Lateral("new-lateral-id", "New Lateral", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("new-network-id", "New Network", LocalDateTime.now(), LocalDateTime.now());

    var existingLateral = new Lateral("old-lateral-id", "Old Lateral", null, LocalDateTime.now(),
      LocalDateTime.now());
    var existingNetwork = new WaterSupplyNetwork("old-network-id", "Old Network", LocalDateTime.now(),
      LocalDateTime.now());
    var existingRoadmap = new Roadmap(id, "Roadmap Old", existingLateral, existingNetwork, LocalDateTime.now(),
      LocalDateTime.now());

    when(roadmapRepository.findById(id)).thenReturn(Optional.of(existingRoadmap));
    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(lateralRepository.findById(request.lateralId())).thenReturn(Optional.of(lateral));
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.of(network));
    when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = roadmapService.updateRoadmap(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Roadmap Updated");
    assertThat(response.lateralId()).isEqualTo("new-lateral-id");
    assertThat(response.networkId()).isEqualTo("new-network-id");
    verify(roadmapRepository).save(existingRoadmap);
  }

  @Test
  void updateRoadmap_should_UpdateOnlyName_When_IdsAreNullOrBlank() {
    // Given
    var id = "roadmap-id";
    var request = new RoadmapRequest("Roadmap Updated", null, ""); // Null and blank checks

    var existingLateral = new Lateral("old-lateral-id", "Old Lateral", null, LocalDateTime.now(),
      LocalDateTime.now());
    var existingNetwork = new WaterSupplyNetwork("old-network-id", "Old Network", LocalDateTime.now(),
      LocalDateTime.now());
    var existingRoadmap = new Roadmap(id, "Roadmap Old", existingLateral, existingNetwork, LocalDateTime.now(),
      LocalDateTime.now());

    when(roadmapRepository.findById(id)).thenReturn(Optional.of(existingRoadmap));
    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = roadmapService.updateRoadmap(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Roadmap Updated");
    assertThat(response.lateralId()).isEqualTo("old-lateral-id"); // Should remain unchanged
    assertThat(response.networkId()).isEqualTo("old-network-id"); // Should remain unchanged
    verify(lateralRepository, never()).findById(any());
    verify(networkRepository, never()).findById(any());
  }

  @Test
  void updateRoadmap_should_ThrowException_When_NotFound() {
    // Given
    var id = "non-existent-id";
    var request = new RoadmapRequest("Any Name", "lat-id", "net-id");
    when(roadmapRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.updateRoadmap(id, request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");

    verify(roadmapRepository, never()).save(any());
  }

  @Test
  void updateRoadmap_should_ThrowException_When_NameAlreadyExists() {
    // Given
    var id = "roadmap-id";
    var request = new RoadmapRequest("Roadmap Existing", "lat-id", "net-id");
    var lateral = new Lateral("lat-id", "Lateral", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("net-id", "Network", LocalDateTime.now(), LocalDateTime.now());
    var existingRoadmap = new Roadmap(id, "Roadmap Old", lateral, network, LocalDateTime.now(),
      LocalDateTime.now());

    when(roadmapRepository.findById(id)).thenReturn(Optional.of(existingRoadmap));
    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> roadmapService.updateRoadmap(id, request))
      .isInstanceOf(ExistingItemException.class)
      .hasMessageContaining("already exists");

    verify(roadmapRepository, never()).save(any());
  }

  @Test
  void deleteRoadmap_should_Delete_When_IdExists() {
    // Given
    var id = "roadmap-id";
    when(roadmapRepository.existsById(id)).thenReturn(true);

    // When
    roadmapService.deleteRoadmap(id);

    // Then
    verify(roadmapRepository).deleteById(id);
  }

  @Test
  void deleteRoadmap_should_ThrowException_When_IdNotFound() {
    // Given
    var id = "non-existent-id";
    when(roadmapRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> roadmapService.deleteRoadmap(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");

    verify(roadmapRepository, never()).deleteById(any());
  }

  @Test
  void getRoadmapById_should_ReturnRoadmap_When_Found() {
    // Given
    var id = "roadmap-id";
    var lateral = new Lateral("lat-id", "Lateral", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("net-id", "Network", LocalDateTime.now(), LocalDateTime.now());
    var roadmap = new Roadmap(id, "Roadmap Test", lateral, network, LocalDateTime.now(), LocalDateTime.now());

    when(roadmapRepository.findById(id)).thenReturn(Optional.of(roadmap));

    // When
    var response = roadmapService.getRoadmapById(id);

    // Then
    assertThat(response.name()).isEqualTo("Roadmap Test");
    assertThat(response.lateralName()).isEqualTo("Lateral");
    assertThat(response.networkName()).isEqualTo("Network");
  }

  @Test
  void getRoadmapById_should_ThrowException_When_NotFound() {
    // Given
    var id = "non-existent-id";
    when(roadmapRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.getRoadmapById(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");
  }

  @Test
  void getAllRoadmaps_should_ReturnPage_When_Called() {
    // Given
    var pageable = Pageable.unpaged();
    var lateral = new Lateral("lat-id", "Lateral", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("net-id", "Network", LocalDateTime.now(), LocalDateTime.now());
    var roadmap = new Roadmap("id", "Roadmap Test", lateral, network, LocalDateTime.now(), LocalDateTime.now());
    Page<Roadmap> page = new PageImpl<>(List.of(roadmap));

    when(roadmapRepository.findAll(pageable)).thenReturn(page);

    // When
    PageResponse<RoadmapResponse> result = roadmapService.getAllRoadmaps(pageable);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Roadmap Test");
  }

  // Helper method for reflection
  private void setField(Object target, String fieldName, Object value) {
    try {
      var field = target.getClass().getDeclaredField(fieldName);
      field.setAccessible(true);
      field.set(target, value);
    } catch (Exception e) {
      throw new RuntimeException("Failed to set field: " + fieldName, e);
    }
  }
}
