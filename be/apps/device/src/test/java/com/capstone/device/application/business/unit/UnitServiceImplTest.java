package com.capstone.device.application.business.unit;

import com.capstone.device.application.dto.request.unit.CreateUnitRequest;
import com.capstone.device.application.dto.request.UpdateUnitRequest;
import com.capstone.device.application.dto.response.UnitResponse;
import com.capstone.device.domain.model.Unit;
import com.capstone.device.infrastructure.persistence.MaterialRepository;
import com.capstone.device.infrastructure.persistence.UnitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnitServiceImplTest {

  @Mock
  UnitRepository unitRepository;

  @Mock
  MaterialRepository materialRepository;

  @Mock
  Logger log;

  @InjectMocks
  UnitServiceImpl unitService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(unitService, "log", log);
  }

  @Test
  void should_ReturnPaginatedUnits_WithoutFilter() {
    var pageable = mock(Pageable.class);
    var unit = createMockUnit("1", "Cái");
    Page<Unit> unitPage = new PageImpl<>(Collections.singletonList(unit));

    when(unitRepository.findAll(pageable)).thenReturn(unitPage);

    Page<UnitResponse> result = unitService.getPaginatedUnits(pageable, null);

    assertEquals(1, result.getTotalElements());
    assertEquals("Cái", result.getContent().getFirst().name());
    verify(unitRepository).findAll(pageable);
  }

  @Test
  void should_ReturnPaginatedUnits_WithFilter() {
    var pageable = mock(Pageable.class);
    var filter = "unit";
    var unit = createMockUnit("1", "Unit");
    Page<Unit> unitPage = new PageImpl<>(Collections.singletonList(unit));

    when(unitRepository.findByNameContainsIgnoreCase(filter, pageable)).thenReturn(unitPage);

    Page<UnitResponse> result = unitService.getPaginatedUnits(pageable, filter);

    assertEquals(1, result.getTotalElements());
    verify(unitRepository).findByNameContainsIgnoreCase(filter, pageable);
  }

  @Test
  void should_CreateUnit_When_NameUnique() {
    var request = new CreateUnitRequest("Unique Unit");
    when(unitRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);

    var savedUnit = createMockUnit("uuid", "Unique Unit");
    when(unitRepository.save(any(Unit.class))).thenReturn(savedUnit);

    var result = unitService.createUnit(request);

    assertNotNull(result);
    assertEquals("Unique Unit", result.name());
    verify(unitRepository).save(any(Unit.class));
  }

  @Test
  void should_ThrowException_When_CreatingWithDuplicateName() {
    var request = new CreateUnitRequest("Duplicate Unit");
    when(unitRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    assertThrows(IllegalArgumentException.class, () -> unitService.createUnit(request));
    verify(unitRepository, never()).save(any());
  }

  @Test
  void should_UpdateUnit_When_Valid() {
    var id = "1";
    var request = new UpdateUnitRequest("New Name");
    var existingUnit = createMockUnit(id, "Old Name");

    when(unitRepository.findById(id)).thenReturn(Optional.of(existingUnit));
    when(unitRepository.existsByNameIgnoreCaseAndIdNot(request.name(), id)).thenReturn(false);
    when(unitRepository.save(any(Unit.class))).thenReturn(existingUnit);

    var result = unitService.updateUnit(id, request);

    assertEquals("New Name", result.name());
    verify(unitRepository).save(existingUnit);
  }

  @Test
  void should_ThrowException_When_UpdatingWithDuplicateName() {
    var id = "1";
    var request = new UpdateUnitRequest("Duplicate Name");
    var existingUnit = createMockUnit(id, "Old Name");

    when(unitRepository.findById(id)).thenReturn(Optional.of(existingUnit));
    when(unitRepository.existsByNameIgnoreCaseAndIdNot(request.name(), id)).thenReturn(true);

    assertThrows(IllegalArgumentException.class, () -> unitService.updateUnit(id, request));
  }

  @Test
  void should_GetUnitById_When_Found() {
    var id = "1";
    var unit = createMockUnit(id, "Test Unit");
    when(unitRepository.findById(id)).thenReturn(Optional.of(unit));

    var result = unitService.getUnitById(id);

    assertEquals("Test Unit", result.name());
  }

  @Test
  void should_ThrowException_When_UnitNotFound() {
    var id = "not-found";
    when(unitRepository.findById(id)).thenReturn(Optional.empty());

    assertThrows(IllegalArgumentException.class, () -> unitService.getUnitById(id));
  }

  @Test
  void should_DeleteUnit_When_NotUsed() {
    var id = "1";
    var unit = createMockUnit(id, "To Delete");

    when(unitRepository.findById(id)).thenReturn(Optional.of(unit));
    when(materialRepository.existsByUnit_Id(id)).thenReturn(false);

    unitService.deleteUnit(id);

    verify(unitRepository).delete(unit);
  }

  @Test
  void should_ThrowException_When_DeletingUsedUnit() {
    var id = "1";
    var unit = createMockUnit(id, "Used Unit");

    when(unitRepository.findById(id)).thenReturn(Optional.of(unit));
    when(materialRepository.existsByUnit_Id(id)).thenReturn(true);

    assertThrows(IllegalArgumentException.class, () -> unitService.deleteUnit(id));
    verify(unitRepository, never()).delete(any());
  }

  private Unit createMockUnit(String id, String name) {
    var unit = Unit.create(builder -> builder.name(name));
    ReflectionTestUtils.setField(unit, "id", id);
    ReflectionTestUtils.setField(unit, "createdAt", LocalDateTime.now());
    ReflectionTestUtils.setField(unit, "updatedAt", LocalDateTime.now());
    return unit;
  }
}
