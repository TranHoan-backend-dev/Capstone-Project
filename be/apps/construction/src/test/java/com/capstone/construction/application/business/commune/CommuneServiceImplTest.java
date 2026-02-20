package com.capstone.construction.application.business.commune;

import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.domain.enumerate.CommuneType;
import com.capstone.construction.domain.model.Commune;
import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import com.capstone.construction.infrastructure.persistence.HamletRepository;
import com.capstone.construction.infrastructure.persistence.NeighborhoodUnitRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
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
class CommuneServiceImplTest {

  @Mock
  CommuneRepository communeRepository;
  @Mock
  HamletRepository hamletRepository;
  @Mock
  NeighborhoodUnitRepository neighborhoodUnitRepository;
  @Mock
  Logger log;

  @InjectMocks
  CommuneServiceImpl communeService;

  @Test
  void createCommune_should_Create_When_RequestIsValid() {
    // Given
    var request = new CommuneRequest("Xa Test", "XA");
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);

    // When
    communeService.createCommune(request);

    // Then
    verify(communeRepository).existsByNameIgnoreCase(request.name());
    verify(communeRepository).save(any(Commune.class));
  }

  @Test
  void createCommune_should_ThrowException_When_NameExists() {
    // Given
    var request = new CommuneRequest("Xa Test", "XA");
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> communeService.createCommune(request))
      .isInstanceOf(ExistingItemException.class)
      .hasMessageContaining("already exists");

    verify(communeRepository, never()).save(any(Commune.class));
  }

  @Test
  void updateCommune_should_Update_When_RequestIsValid() {
    // Given
    var id = "commune-id";
    var request = new CommuneRequest("Xa Updated", "PHUONG");

    var existingCommune = Commune.create(builder -> builder.name("Xa Old").type(CommuneType.RURAL_COMMUNE));
    setField(existingCommune, "communeId", id);
    setField(existingCommune, "createdAt", LocalDateTime.now());
    setField(existingCommune, "updatedAt", LocalDateTime.now());

    when(communeRepository.findById(id)).thenReturn(Optional.of(existingCommune));
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(communeRepository.save(any(Commune.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    CommuneResponse response = communeService.updateCommune(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Xa Updated");
    assertThat(response.type()).isEqualTo("phuong");
    verify(communeRepository).save(existingCommune);
  }

  @Test
  void updateCommune_should_ThrowException_When_NotFound() {
    // Given
    var id = "non-existent-id";
    var request = new CommuneRequest("Xa Updated", "PHUONG");
    when(communeRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> communeService.updateCommune(id, request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");

    verify(communeRepository, never()).save(any());
  }

  @Test
  void updateCommune_should_ThrowException_When_NameAlreadyExists() {
    // Given
    var id = "commune-id";
    var request = new CommuneRequest("Xa Existing", "XA");
    var existingCommune = Commune.create(builder -> builder.name("Xa Old").type(CommuneType.URBAN_WARD));
    setField(existingCommune, "communeId", id);
    setField(existingCommune, "createdAt", java.time.LocalDateTime.now());

    when(communeRepository.findById(id)).thenReturn(Optional.of(existingCommune));
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> communeService.updateCommune(id, request))
      .isInstanceOf(ExistingItemException.class)
      .hasMessageContaining("already exists");

    verify(communeRepository, never()).save(any());
  }

  @Test
  void updateCommune_should_NotUpdate_When_DataIsSame_AndNameCheckPasses() {
    // Given
    var id = "commune-id";
    var request = new CommuneRequest("Xa Old", "XA");
    var existingCommune = Commune.create(builder -> builder.name("Xa Old").type(CommuneType.RURAL_COMMUNE));
    setField(existingCommune, "communeId", id);
    setField(existingCommune, "createdAt", java.time.LocalDateTime.now());

    when(communeRepository.findById(id)).thenReturn(Optional.of(existingCommune));
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> communeService.updateCommune(id, request))
      .isInstanceOf(ExistingItemException.class);
  }

  @Test
  void deleteCommune_should_Delete_When_IdExists() {
    // Given
    var id = "commune-id";
    when(communeRepository.existsById(id)).thenReturn(true);
    when(hamletRepository.existsByCommune_CommuneId(id)).thenReturn(true);
    when(neighborhoodUnitRepository.existsByCommune_CommuneId(id)).thenReturn(true);

    // When
    communeService.deleteCommune(id);

    // Then
    verify(hamletRepository).deleteByCommune_CommuneId(id);
    verify(neighborhoodUnitRepository).deleteByCommune_CommuneId(id);
    verify(communeRepository).deleteById(id);
  }

  @Test
  void deleteCommune_should_ThrowException_When_IdNotFound() {
    // Given
    var id = "non-existent-id";
    when(communeRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> communeService.deleteCommune(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");

    verify(communeRepository, never()).deleteById(any());
  }

  @Test
  void getCommuneById_should_ReturnCommune_When_Found() {
    // Given
    var id = "commune-id";
    var commune = Commune.create(builder -> builder.name("Xa Test").type(CommuneType.RURAL_COMMUNE));
    setField(commune, "communeId", id);
    setField(commune, "createdAt", LocalDateTime.now());

    when(communeRepository.findById(id)).thenReturn(Optional.of(commune));

    // When
    var response = communeService.getCommuneById(id);

    // Then
    assertThat(response.name()).isEqualTo("Xa Test");
    assertThat(response.type()).isEqualTo("xa");
  }

  @Test
  void getCommuneById_should_ThrowException_When_NotFound() {
    // Given
    var id = "non-existent-id";
    when(communeRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> communeService.getCommuneById(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("not found");
  }

  @Test
  void getAllCommunes_should_ReturnPage_When_Called() {
    // Given
    var pageable = Pageable.unpaged();
    var commune = Commune.create(builder -> builder.name("Xa Test").type(CommuneType.URBAN_WARD));
    setField(commune, "communeId", "id");
    setField(commune, "createdAt", LocalDateTime.now());

    Page<Commune> page = new PageImpl<>(List.of(commune));
    when(communeRepository.findAll(pageable)).thenReturn(page);

    // When
    PageResponse<CommuneResponse> result = communeService.getAllCommunes(pageable);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Xa Test");
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
