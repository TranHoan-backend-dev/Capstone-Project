package com.capstone.construction.application.business.road;

import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.domain.model.Road;
import com.capstone.construction.infrastructure.persistence.RoadRepository;
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
class RoadServiceImplTest {

  @Mock
  RoadRepository roadRepository;

  @InjectMocks
  RoadServiceImpl roadService;

  @Test
  void should_CreateRoad_When_RequestIsValid() {
    // Given
    var request = new RoadRequest("Road Test");
    when(roadRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(roadRepository.save(any(Road.class))).thenAnswer(invocation -> {
      Road r = invocation.getArgument(0);
      ReflectionTestUtils.setField(r, "roadId", "road-id");
      ReflectionTestUtils.setField(r, "createdAt", LocalDateTime.now());
      return r;
    });

    // When
    var response = roadService.createRoad(request);

    // Then
    assertThat(response.name()).isEqualTo("Road Test");
    verify(roadRepository).existsByNameIgnoreCase(request.name());
    verify(roadRepository).save(any(Road.class));
  }

  @Test
  void should_ThrowException_When_CreateNameExists() {
    // Given
    var request = new RoadRequest("Road Test");
    when(roadRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> roadService.createRoad(request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessageContaining("already exists");

    verify(roadRepository, never()).save(any(Road.class));
  }

  @Test
  void should_ThrowException_When_CreateNameIsBlank() {
    // Given
    var request = new RoadRequest("");
    when(roadRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> roadService.createRoad(request))
        .isExactlyInstanceOf(IllegalArgumentException.class);

    verify(roadRepository, never()).save(any(Road.class));
  }

  @Test
  void should_UpdateRoad_When_RequestIsValid() {
    // Given
    var id = "road-id";
    var request = new RoadRequest("Road Updated");
    var existingRoad = new Road(id, "Road Old", LocalDateTime.now(), LocalDateTime.now());

    when(roadRepository.findById(id)).thenReturn(Optional.of(existingRoad));
    when(roadRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(roadRepository.save(any(Road.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = roadService.updateRoad(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Road Updated");
    verify(roadRepository).save(existingRoad);
  }

  @Test
  void should_ThrowException_When_UpdateNotFound() {
    // Given
    var id = "non-existent-id";
    var request = new RoadRequest("Road Updated");
    when(roadRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadService.updateRoad(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");

    verify(roadRepository, never()).save(any());
  }

  @Test
  void should_ThrowException_When_UpdateNameAlreadyExists() {
    // Given
    var id = "road-id";
    var request = new RoadRequest("Road Existing");
    var existingRoad = new Road(id, "Road Old", LocalDateTime.now(), LocalDateTime.now());

    when(roadRepository.findById(id)).thenReturn(Optional.of(existingRoad));
    when(roadRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> roadService.updateRoad(id, request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessageContaining("already exists");

    verify(roadRepository, never()).save(any());
  }

  @Test
  void should_UpdateRoad_When_DataIsSameAndNameCheckPasses() {
    // Given
    var id = "road-id";
    var request = new RoadRequest("Road Old");
    var existingRoad = new Road(id, "Road Old", LocalDateTime.now(), LocalDateTime.now());

    when(roadRepository.findById(id)).thenReturn(Optional.of(existingRoad));
    when(roadRepository.save(any(Road.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = roadService.updateRoad(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Road Old");
    verify(roadRepository).save(existingRoad);
  }

  @Test
  void should_DeleteRoad_When_IdExists() {
    // Given
    var id = "road-id";
    when(roadRepository.existsById(id)).thenReturn(true);

    // When
    roadService.deleteRoad(id);

    // Then
    verify(roadRepository).deleteById(id);
  }

  @Test
  void should_ThrowException_When_DeleteIdNotFound() {
    // Given
    var id = "non-existent-id";
    when(roadRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> roadService.deleteRoad(id))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");

    verify(roadRepository, never()).deleteById(any());
  }

  @Test
  void should_ReturnRoad_When_GetByIdFound() {
    // Given
    var id = "road-id";
    var road = new Road(id, "Road Test", LocalDateTime.now(), LocalDateTime.now());

    when(roadRepository.findById(id)).thenReturn(Optional.of(road));

    // When
    var response = roadService.getRoadById(id);

    // Then
    assertThat(response.name()).isEqualTo("Road Test");
  }

  @Test
  void should_ThrowException_When_GetByIdNotFound() {
    // Given
    var id = "non-existent-id";
    when(roadRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadService.getRoadById(id))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");
  }

  @Test
  void should_ReturnPage_When_GetAllRoads() {
    // Given
    var pageable = Pageable.unpaged();
    var road = new Road("id", "Road Test", LocalDateTime.now(), LocalDateTime.now());
    var page = new PageImpl<>(List.of(road));
    when(roadRepository.findAll(pageable)).thenReturn(page);

    // When
    var result = roadService.getAllRoads(pageable);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Road Test");
  }
}
