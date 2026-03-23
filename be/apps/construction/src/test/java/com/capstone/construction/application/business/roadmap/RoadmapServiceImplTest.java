package com.capstone.construction.application.business.roadmap;

import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

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
  void should_CreateRoadmap_When_RequestIsValid() {
    // Given
    var request = new RoadmapRequest("Roadmap Test", "lateral-id", "network-id");
    var lateral = new Lateral("lateral-id", "Lateral Name", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("network-id", "Network Name", LocalDateTime.now(), LocalDateTime.now());

    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(lateralRepository.findById(request.lateralId())).thenReturn(Optional.of(lateral));
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.of(network));

    when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(invocation -> {
      var r = (Roadmap) invocation.getArgument(0);
      ReflectionTestUtils.setField(r, "roadmapId", "roadmap-id");
      ReflectionTestUtils.setField(r, "createdAt", LocalDateTime.now());
      ReflectionTestUtils.setField(r, "updatedAt", LocalDateTime.now());
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
  void should_ThrowException_When_CreateNameExists() {
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
  void should_ThrowException_When_CreateLateralNotFound() {
    // Given
    var request = new RoadmapRequest("Roadmap Test", "lateral-id", "network-id");
    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(lateralRepository.findById(request.lateralId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.createRoadmap(request))
        .isExactlyInstanceOf(IllegalArgumentException.class);

    verify(roadmapRepository, never()).save(any(Roadmap.class));
  }

  @Test
  void should_ThrowException_When_CreateNetworkNotFound() {
    // Given
    var request = new RoadmapRequest("Roadmap Test", "lateral-id", "network-id");
    var lateral = new Lateral("lateral-id", "Lateral Name", null, LocalDateTime.now(), LocalDateTime.now());

    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(lateralRepository.findById(request.lateralId())).thenReturn(Optional.of(lateral));
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.createRoadmap(request))
        .isExactlyInstanceOf(IllegalArgumentException.class);

    verify(roadmapRepository, never()).save(any(Roadmap.class));
  }

  @Test
  void should_ThrowException_When_CreateNameIsNull() {
    // Given
    var request = new RoadmapRequest(null, "lateral-id", "network-id");

    // When & Then
    assertThatThrownBy(() -> roadmapService.createRoadmap(request))
        .isInstanceOf(NullPointerException.class);

    verify(roadmapRepository, never()).save(any(Roadmap.class));
  }

  @Test
  void should_UpdateRoadmap_When_RequestIsValid() {
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
        LocalDateTime.now(), "");

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
  void should_UpdateOnlyName_When_UpdateIdsAreNullOrBlank() {
    // Given
    var id = "roadmap-id";
    var request = new RoadmapRequest("Roadmap Updated", null, "");

    var existingLateral = new Lateral("old-lateral-id", "Old Lateral", null, LocalDateTime.now(),
        LocalDateTime.now());
    var existingNetwork = new WaterSupplyNetwork("old-network-id", "Old Network", LocalDateTime.now(),
        LocalDateTime.now());
    var existingRoadmap = new Roadmap(id, "Roadmap Old", existingLateral, existingNetwork, LocalDateTime.now(),
        LocalDateTime.now(), "");

    when(roadmapRepository.findById(id)).thenReturn(Optional.of(existingRoadmap));
    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(false);
    when(roadmapRepository.save(any(Roadmap.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = roadmapService.updateRoadmap(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Roadmap Updated");
    assertThat(response.lateralId()).isEqualTo("old-lateral-id");
    assertThat(response.networkId()).isEqualTo("old-network-id");
    verify(lateralRepository, never()).findById(any());
    verify(networkRepository, never()).findById(any());
  }

  @Test
  void should_ThrowException_When_UpdateLateralNotFound() {
    // Given
    var id = "roadmap-id";
    var request = new RoadmapRequest("Name", "non-existent", null);
    var lateral = new Lateral("old-lat", "Old", null, null, null);
    var network = new WaterSupplyNetwork("old-net", "Old", null, null);
    var existingRoadmap = new Roadmap(id, "Old", lateral, network, null, null, "");
    when(roadmapRepository.findById(id)).thenReturn(Optional.of(existingRoadmap));
    when(lateralRepository.findById("non-existent")).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.updateRoadmap(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void should_ThrowException_When_UpdateNetworkNotFound() {
    // Given
    var id = "roadmap-id";
    var request = new RoadmapRequest("Name", null, "non-existent");
    var lateral = new Lateral("old-lat", "Old", null, null, null);
    var network = new WaterSupplyNetwork("old-net", "Old", null, null);
    var existingRoadmap = new Roadmap(id, "Old", lateral, network, null, null, "");
    when(roadmapRepository.findById(id)).thenReturn(Optional.of(existingRoadmap));
    when(networkRepository.findById("non-existent")).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.updateRoadmap(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void should_ThrowException_When_UpdateNotFound() {
    // Given
    var id = "non-existent-id";
    var request = new RoadmapRequest("Any Name", "lat-id", "net-id");
    when(roadmapRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.updateRoadmap(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");

    verify(roadmapRepository, never()).save(any());
  }

  @Test
  void should_ThrowException_When_UpdateNameAlreadyExists() {
    // Given
    var id = "roadmap-id";
    var request = new RoadmapRequest("Roadmap Existing", "lat-id", "net-id");
    var lateral = new Lateral("lat-id", "Lateral", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("net-id", "Network", LocalDateTime.now(), LocalDateTime.now());
    var existingRoadmap = new Roadmap(id, "Roadmap Old", lateral, network, LocalDateTime.now(),
        LocalDateTime.now(), "");

    when(roadmapRepository.findById(id)).thenReturn(Optional.of(existingRoadmap));
    when(roadmapRepository.existsByNameEqualsIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> roadmapService.updateRoadmap(id, request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessageContaining("already exists");

    verify(roadmapRepository, never()).save(any());
  }

  @Test
  void should_DeleteRoadmap_When_IdExists() {
    // Given
    var id = "roadmap-id";
    when(roadmapRepository.existsById(id)).thenReturn(true);

    // When
    roadmapService.deleteRoadmap(id);

    // Then
    verify(roadmapRepository).deleteById(id);
  }

  @Test
  void should_ThrowException_When_DeleteIdNotFound() {
    // Given
    var id = "non-existent-id";
    when(roadmapRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> roadmapService.deleteRoadmap(id))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");

    verify(roadmapRepository, never()).deleteById(any());
  }

  @Test
  void should_ReturnRoadmap_When_GetByIdFound() {
    // Given
    var id = "roadmap-id";
    var lateral = new Lateral("lat-id", "Lateral", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("net-id", "Network", LocalDateTime.now(), LocalDateTime.now());
    var roadmap = new Roadmap(id, "Roadmap Test", lateral, network, LocalDateTime.now(), LocalDateTime.now(), "");

    when(roadmapRepository.findById(id)).thenReturn(Optional.of(roadmap));

    // When
    var response = roadmapService.getRoadmapById(id);

    // Then
    assertThat(response.name()).isEqualTo("Roadmap Test");
    assertThat(response.lateralName()).isEqualTo("Lateral");
    assertThat(response.networkName()).isEqualTo("Network");
  }

  @Test
  void should_ThrowException_When_GetByIdNotFound() {
    // Given
    var id = "non-existent-id";
    when(roadmapRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadmapService.getRoadmapById(id))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");
  }

  @Test
  void should_ReturnPage_When_GetAllRoadmaps() {
    // Given
    var pageable = Pageable.unpaged();
    var lateral = new Lateral("lat-id", "Lateral", null, LocalDateTime.now(), LocalDateTime.now());
    var network = new WaterSupplyNetwork("net-id", "Network", LocalDateTime.now(), LocalDateTime.now());
    var roadmap = new Roadmap("id", "Roadmap Test", lateral, network, LocalDateTime.now(), LocalDateTime.now(), "");
    var page = new PageImpl<>(List.of(roadmap));

    when(roadmapRepository.findAll(pageable)).thenReturn(page);

    // When
    var result = roadmapService.getAllRoadmaps(pageable);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Roadmap Test");
  }
}
