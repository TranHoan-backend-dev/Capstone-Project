package com.capstone.construction.application.business.commune;

import com.capstone.construction.application.dto.request.commune.CreateRequest;
import com.capstone.construction.application.dto.request.commune.UpdateRequest;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.common.utils.TextNormalizer;
import com.capstone.construction.domain.enumerate.CommuneType;
import com.capstone.construction.domain.model.Commune;
import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import com.capstone.construction.infrastructure.persistence.HamletRepository;
import com.capstone.construction.infrastructure.persistence.NeighborhoodUnitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
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

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(communeService, "log", LoggerFactory.getLogger(CommuneServiceImpl.class));
  }

  @Test
  void should_CreateCommune_When_RequestIsValid() {
    // Given
    var request = new CreateRequest("Xa Test", CommuneType.RURAL_COMMUNE);
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);

    // When
    communeService.createCommune(request);

    // Then
    verify(communeRepository).existsByNameIgnoreCase(request.name());
    verify(communeRepository).save(any(Commune.class));
  }

  @Test
  void should_ThrowException_When_CreateNameExists() {
    // Given
    var request = new CreateRequest("Xa Test", CommuneType.RURAL_COMMUNE);
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> communeService.createCommune(request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessageContaining("already exists");

    verify(communeRepository, never()).save(any(Commune.class));
  }

  @Test
  void should_UpdateCommune_When_RequestIsValid() {
    // Given
    var id = "commune-id";
    var request = new UpdateRequest("Xa Updated", CommuneType.URBAN_WARD);

    var existingCommune = Commune.create(builder -> builder.name("Xa Old").type(CommuneType.RURAL_COMMUNE));
    ReflectionTestUtils.setField(existingCommune, "communeId", id);
    ReflectionTestUtils.setField(existingCommune, "createdAt", LocalDateTime.now());
    ReflectionTestUtils.setField(existingCommune, "updatedAt", LocalDateTime.now());

    when(communeRepository.findById(id)).thenReturn(Optional.of(existingCommune));
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(communeRepository.save(any(Commune.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = communeService.updateCommune(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Xa Updated");
    assertThat(response.type()).isEqualTo(CommuneType.URBAN_WARD);
    verify(communeRepository).save(existingCommune);
  }

  @Test
  void should_ThrowException_When_UpdateNotFound() {
    // Given
    var id = "non-existent-id";
    var request = new UpdateRequest("Xa Updated", CommuneType.URBAN_WARD);
    when(communeRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> communeService.updateCommune(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");

    verify(communeRepository, never()).save(any());
  }

  @Test
  void should_ThrowException_When_UpdateNameAlreadyExists() {
    // Given
    var id = "commune-id";
    var request = new UpdateRequest("Xa Existing", CommuneType.RURAL_COMMUNE);
    var existingCommune = Commune.create(builder -> builder.name("Xa Old").type(CommuneType.URBAN_WARD));
    ReflectionTestUtils.setField(existingCommune, "communeId", id);
    ReflectionTestUtils.setField(existingCommune, "createdAt", LocalDateTime.now());

    when(communeRepository.findById(id)).thenReturn(Optional.of(existingCommune));
    when(communeRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> communeService.updateCommune(id, request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessageContaining("already exists");

    verify(communeRepository, never()).save(any());
  }

  @Test
  void should_NotThrowException_When_UpdateNameIsSame() {
    // Given
    var id = "commune-id";
    var request = new UpdateRequest("Xa Old", CommuneType.RURAL_COMMUNE);
    var existingCommune = Commune.create(builder -> builder.name("Xa Old").type(CommuneType.RURAL_COMMUNE));
    ReflectionTestUtils.setField(existingCommune, "communeId", id);
    ReflectionTestUtils.setField(existingCommune, "createdAt", LocalDateTime.now());

    when(communeRepository.findById(id)).thenReturn(Optional.of(existingCommune));
    when(communeRepository.save(any(Commune.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = communeService.updateCommune(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Xa Old");
    verify(communeRepository, never()).existsByNameIgnoreCase(any());
    verify(communeRepository).save(existingCommune);
  }

  @Test
  void should_DeleteCommune_When_IdExists() {
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
  void should_ThrowException_When_DeleteIdNotFound() {
    // Given
    var id = "non-existent-id";
    when(communeRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> communeService.deleteCommune(id))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");

    verify(communeRepository, never()).deleteById(any());
  }

  @Test
  void should_ReturnCommune_When_GetByIdFound() {
    // Given
    var id = "commune-id";
    var commune = Commune.create(builder -> builder.name("Xa Test").type(CommuneType.RURAL_COMMUNE));
    ReflectionTestUtils.setField(commune, "communeId", id);
    ReflectionTestUtils.setField(commune, "createdAt", LocalDateTime.now());

    when(communeRepository.findById(id)).thenReturn(Optional.of(commune));

    // When
    var response = communeService.getCommuneById(id);

    // Then
    assertThat(response.name()).isEqualTo("Xa Test");
    assertThat(response.type()).isEqualTo(CommuneType.RURAL_COMMUNE);
  }

  @Test
  void should_ThrowException_When_GetByIdNotFound() {
    // Given
    var id = "non-existent-id";
    when(communeRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> communeService.getCommuneById(id))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");
  }

  @Test
  void should_ReturnPage_When_GetAllCommunes() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var commune = Commune.create(builder -> builder.name("Xa Test").type(CommuneType.URBAN_WARD));
    ReflectionTestUtils.setField(commune, "communeId", "id");
    ReflectionTestUtils.setField(commune, "createdAt", LocalDateTime.now());

    var page = new PageImpl<>(List.of(commune));
    when(communeRepository.findAll(pageable)).thenReturn(page);

    // When
    var result = communeService.getAllCommunes(pageable, null, null);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Xa Test");
  }

  @Test
  void should_SearchAccentInsensitive_When_SearchByName() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var search = "hoa binh";
    var normalized = TextNormalizer.normalizeForSearch(search);

    var commune = Commune.create(builder -> builder.name("Hòa Bình").type(CommuneType.RURAL_COMMUNE));
    ReflectionTestUtils.setField(commune, "communeId", "id");
    ReflectionTestUtils.setField(commune, "createdAt", LocalDateTime.now());

    var page = new PageImpl<>(List.of(commune));
    when(communeRepository.findAllByNameSearchContains(normalized, pageable)).thenReturn(page);

    // When
    var result = communeService.getAllCommunes(pageable, search, null);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Hòa Bình");
    verify(communeRepository, times(1)).findAllByNameSearchContains(normalized, pageable);
    verify(communeRepository, never()).findAllByNameSearchContainsAndType(anyString(), any(), any());
  }

  @Test
  void should_SearchAccentInsensitive_WithTypeFilter_When_SearchByNameAndType() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var search = "hoa binh";
    var normalized = TextNormalizer.normalizeForSearch(search);
    var type = "RURAL_COMMUNE";

    var commune = Commune.create(builder -> builder.name("Hòa Bình").type(CommuneType.RURAL_COMMUNE));
    ReflectionTestUtils.setField(commune, "communeId", "id");
    ReflectionTestUtils.setField(commune, "createdAt", LocalDateTime.now());

    var page = new PageImpl<>(List.of(commune));
    when(communeRepository.findAllByNameSearchContainsAndType(normalized, CommuneType.RURAL_COMMUNE, pageable))
      .thenReturn(page);

    // When
    var result = communeService.getAllCommunes(pageable, search, type);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Hòa Bình");
    verify(communeRepository, times(1))
      .findAllByNameSearchContainsAndType(normalized, CommuneType.RURAL_COMMUNE, pageable);
    verify(communeRepository, never()).findAllByNameSearchContains(anyString(), any());
  }
}
