package com.capstone.construction.application.business.road;

import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.dto.response.catalog.RoadResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.domain.model.Road;
import com.capstone.construction.infrastructure.persistence.RoadRepository;
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
class RoadServiceImplTest {

  @Mock
  RoadRepository roadRepository;

  @InjectMocks
  RoadServiceImpl roadService;

  @Test
  void createRoad_should_Create_When_RequestIsValid() {
    // Given
    var request = new RoadRequest("Road Test");
    when(roadRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(roadRepository.save(any(Road.class))).thenAnswer(invocation -> {
      Road r = invocation.getArgument(0);
      setField(r, "roadId", "road-id");
      setField(r, "createdAt", LocalDateTime.now());
      return r;
    });

    // When
    RoadResponse response = roadService.createRoad(request);

    // Then
    assertThat(response.name()).isEqualTo("Road Test");
    verify(roadRepository).existsByNameIgnoreCase(request.name());
    verify(roadRepository).save(any(Road.class));
  }

  @Test
  void createRoad_should_ThrowException_When_NameExists() {
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
  void createRoad_should_ThrowException_When_NameIsBlank() {
    // Given
    var request = new RoadRequest("");
    // Logic in service checks existsByName first, then blank check.
    // But blank check should probably come first or validation annotations handle
    // it.
    // In provided code:
    // 1. check existsByNameIgnoreCase
    // 2. check isBlank -> throw IllegalArgumentException

    when(roadRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> roadService.createRoad(request))
      .isInstanceOf(IllegalArgumentException.class);

    verify(roadRepository, never()).save(any(Road.class));
  }

  @Test
  void updateRoad_should_Update_When_RequestIsValid() {
    // Given
    var id = "road-id";
    var request = new RoadRequest("Road Updated");
    var existingRoad = new Road(id, "Road Old", LocalDateTime.now(), LocalDateTime.now());

    when(roadRepository.findById(id)).thenReturn(Optional.of(existingRoad));
    when(roadRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(roadRepository.save(any(Road.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    RoadResponse response = roadService.updateRoad(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Road Updated");
    verify(roadRepository).save(existingRoad);
  }

  @Test
  void updateRoad_should_ThrowException_When_NotFound() {
    // Given
    var id = "non-existent-id";
    var request = new RoadRequest("Road Updated");
    when(roadRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadService.updateRoad(id, request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");

    verify(roadRepository, never()).save(any());
  }

  @Test
  void updateRoad_should_ThrowException_When_NameAlreadyExists() {
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
  void updateRoad_should_NotUpdate_When_DataIsSame_AndNameCheckPasses() {
    // Given
    var id = "road-id";
    var request = new RoadRequest("Road Old");
    var existingRoad = new Road(id, "Road Old", LocalDateTime.now(), LocalDateTime.now());

    when(roadRepository.findById(id)).thenReturn(Optional.of(existingRoad));

    // The logic in updateRoad:
    // if (!road.getName().equalsIgnoreCase(request.name()) &&
    // roadRepository.existsByNameIgnoreCase(request.name()))
    // Since names are equal (ignore case), the second part && ... is NOT evaluated
    // or doesn't matter.
    // So it skips the exist check exception.
    // Then it proceeds to save.

    when(roadRepository.save(any(Road.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    RoadResponse response = roadService.updateRoad(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Road Old");
    verify(roadRepository).save(existingRoad);
  }

  @Test
  void deleteRoad_should_Delete_When_IdExists() {
    // Given
    var id = "road-id";
    when(roadRepository.existsById(id)).thenReturn(true);

    // When
    roadService.deleteRoad(id);

    // Then
    verify(roadRepository).deleteById(id);
  }

  @Test
  void deleteRoad_should_ThrowException_When_IdNotFound() {
    // Given
    var id = "non-existent-id";
    when(roadRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> roadService.deleteRoad(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");

    verify(roadRepository, never()).deleteById(any());
  }

  @Test
  void getRoadById_should_ReturnRoad_When_Found() {
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
  void getRoadById_should_ThrowException_When_NotFound() {
    // Given
    var id = "non-existent-id";
    when(roadRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> roadService.getRoadById(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");
  }

  @Test
  void getAllRoads_should_ReturnPage_When_Called() {
    // Given
    var pageable = Pageable.unpaged();
    var road = new Road("id", "Road Test", LocalDateTime.now(), LocalDateTime.now());
    Page<Road> page = new PageImpl<>(List.of(road));
    when(roadRepository.findAll(pageable)).thenReturn(page);

    // When
    PageResponse<RoadResponse> result = roadService.getAllRoads(pageable);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Road Test");
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
