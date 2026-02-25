package com.capstone.construction.application.business.unit;

import com.capstone.construction.application.dto.request.catalog.NeighborhoodUnitRequest;
import com.capstone.construction.application.dto.response.catalog.NeighborhoodUnitResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.domain.enumerate.CommuneType;
import com.capstone.construction.domain.model.Commune;
import com.capstone.construction.domain.model.NeighborhoodUnit;
import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import com.capstone.construction.infrastructure.persistence.NeighborhoodUnitRepository;
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
class NeighborhoodUnitServiceImplTest {

  @Mock
  NeighborhoodUnitRepository unitRepository;
  @Mock
  CommuneRepository communeRepository;

  @InjectMocks
  NeighborhoodUnitServiceImpl unitService;

  @Test
  void createUnit_should_Create_When_RequestIsValid() {
    // Given
    var request = new NeighborhoodUnitRequest("Unit Test", "commune-id");
    var commune = new Commune("commune-id", "Commune Test", CommuneType.URBAN_WARD, LocalDateTime.now(),
      LocalDateTime.now());

    when(unitRepository.existsByName(request.name())).thenReturn(false);
    when(communeRepository.findById(request.communeId())).thenReturn(Optional.of(commune));
    when(unitRepository.save(any(NeighborhoodUnit.class))).thenAnswer(invocation -> {
      NeighborhoodUnit u = invocation.getArgument(0);
      setField(u, "unitId", "unit-id");
      setField(u, "createdAt", LocalDateTime.now());
      setField(u, "updatedAt", LocalDateTime.now());
      return u;
    });

    // When
    unitService.createUnit(request);

    // Then
    verify(unitRepository).save(any(NeighborhoodUnit.class));
  }

  @Test
  void createUnit_should_ThrowException_When_NameExists() {
    // Given
    var request = new NeighborhoodUnitRequest("Unit Test", "commune-id");
    when(unitRepository.existsByName(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> unitService.createUnit(request))
      .isInstanceOf(ExistingItemException.class)
      .hasMessageContaining("already exists");

    verify(unitRepository, never()).save(any(NeighborhoodUnit.class));
  }

  @Test
  void createUnit_should_ThrowException_When_CommuneNotFound() {
    // Given
    var request = new NeighborhoodUnitRequest("Unit Test", "commune-id");
    when(unitRepository.existsByName(request.name())).thenReturn(false);
    when(communeRepository.findById(request.communeId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> unitService.createUnit(request))
      .isInstanceOf(IllegalArgumentException.class);

    verify(unitRepository, never()).save(any(NeighborhoodUnit.class));
  }

  @Test
  void updateUnit_should_Update_When_RequestIsValid() {
    // Given
    var id = "unit-id";
    var request = new NeighborhoodUnitRequest("Unit Updated", "new-commune-id");
    var commune = new Commune("new-commune-id", "Commune New", CommuneType.URBAN_WARD, LocalDateTime.now(),
      LocalDateTime.now());
    var existingCommune = new Commune("old-commune-id", "Commune Old", CommuneType.URBAN_WARD, LocalDateTime.now(),
      LocalDateTime.now());
    var existingUnit = new NeighborhoodUnit(id, "Unit Old", existingCommune, LocalDateTime.now(),
      LocalDateTime.now());

    when(unitRepository.findById(id)).thenReturn(Optional.of(existingUnit));
    when(unitRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(communeRepository.findById(request.communeId())).thenReturn(Optional.of(commune));
    when(unitRepository.save(any(NeighborhoodUnit.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = unitService.updateUnit(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Unit Updated");
    assertThat(response.communeId()).isEqualTo("new-commune-id");
    verify(unitRepository).save(existingUnit);
  }

  @Test
  void updateUnit_should_ThrowException_When_NotFound() {
    // Given
    var id = "non-existent-id";
    var request = new NeighborhoodUnitRequest("Any Name", "commune-id");
    when(unitRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> unitService.updateUnit(id, request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");

    verify(unitRepository, never()).save(any());
  }

  @Test
  void updateUnit_should_ThrowException_When_NameAlreadyExists() {
    // Given
    var id = "unit-id";
    var request = new NeighborhoodUnitRequest("Unit Existing", "commune-id");
    var commune = new Commune("commune-id", "Commune", CommuneType.URBAN_WARD, LocalDateTime.now(),
      LocalDateTime.now());
    var existingUnit = new NeighborhoodUnit(id, "Unit Old", commune, LocalDateTime.now(), LocalDateTime.now());

    when(unitRepository.findById(id)).thenReturn(Optional.of(existingUnit));
    when(unitRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> unitService.updateUnit(id, request))
      .isInstanceOf(ExistingItemException.class)
      .hasMessageContaining("already exists");

    verify(unitRepository, never()).save(any());
  }

  @Test
  void updateUnit_should_ThrowException_When_CommuneNotFound() {
    // Given
    var id = "unit-id";
    var request = new NeighborhoodUnitRequest("Unit Updated", "non-existent-commune");
    var existingCommune = new Commune("old-commune-id", "Commune Old", CommuneType.URBAN_WARD, LocalDateTime.now(),
      LocalDateTime.now());
    var existingUnit = new NeighborhoodUnit(id, "Unit Old", existingCommune, LocalDateTime.now(),
      LocalDateTime.now());

    when(unitRepository.findById(id)).thenReturn(Optional.of(existingUnit));
    when(unitRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(communeRepository.findById(request.communeId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> unitService.updateUnit(id, request))
      .isInstanceOf(IllegalArgumentException.class);

    verify(unitRepository, never()).save(any());
  }

  @Test
  void deleteUnit_should_Delete_When_IdExists() {
    // Given
    var id = "unit-id";
    when(unitRepository.existsById(id)).thenReturn(true);

    // When
    unitService.deleteUnit(id);

    // Then
    verify(unitRepository).deleteById(id);
  }

  @Test
  void deleteUnit_should_ThrowException_When_IdNotFound() {
    // Given
    var id = "non-existent-id";
    when(unitRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> unitService.deleteUnit(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");

    verify(unitRepository, never()).deleteById(any());
  }

  @Test
  void getUnitById_should_ReturnUnit_When_Found() {
    // Given
    var id = "unit-id";
    var commune = new Commune("commune-id", "Commune", CommuneType.URBAN_WARD, LocalDateTime.now(),
      LocalDateTime.now());
    var unit = new NeighborhoodUnit(id, "Unit Test", commune, LocalDateTime.now(), LocalDateTime.now());

    when(unitRepository.findById(id)).thenReturn(Optional.of(unit));

    // When
    var response = unitService.getUnitById(id);

    // Then
    assertThat(response.name()).isEqualTo("Unit Test");
    assertThat(response.communeName()).isEqualTo("Commune");
  }

  @Test
  void getUnitById_should_ThrowException_When_NotFound() {
    // Given
    var id = "non-existent-id";
    when(unitRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> unitService.getUnitById(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");
  }

  @Test
  void getAllUnits_should_ReturnPage_When_Called() {
    // Given
    var pageable = Pageable.unpaged();
    var commune = new Commune("commune-id", "Commune", CommuneType.URBAN_WARD, LocalDateTime.now(),
      LocalDateTime.now());
    var unit = new NeighborhoodUnit("id", "Unit Test", commune, LocalDateTime.now(), LocalDateTime.now());
    Page<NeighborhoodUnit> page = new PageImpl<>(List.of(unit));

    when(unitRepository.findAll(pageable)).thenReturn(page);

    // When
    PageResponse<NeighborhoodUnitResponse> result = unitService.getAllUnits(pageable);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Unit Test");
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
