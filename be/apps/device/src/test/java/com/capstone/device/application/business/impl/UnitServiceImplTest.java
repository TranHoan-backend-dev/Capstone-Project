package com.capstone.device.application.business.impl;

import com.capstone.common.utils.IdEncoder;
import com.capstone.device.application.dto.response.UnitResponse;
import com.capstone.device.domain.model.Unit;
import com.capstone.device.infrastructure.persistence.UnitRepository;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnitServiceImplTest {

  @Mock
  UnitRepository unitRepository;

  @Mock
  Logger log;

  @InjectMocks
  UnitServiceImpl unitService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(unitService, "log", log);
  }

  @Test
  @DisplayName("should_ReturnAllUnits_When_FilterIsNull")
  void should_ReturnAllUnits_When_FilterIsNull() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    var unit = new Unit("unit-1", "Unit 1", LocalDateTime.now(), LocalDateTime.now());
    Page<Unit> page = new PageImpl<>(List.of(unit));

    when(unitRepository.findAll(pageable)).thenReturn(page);

    // Act
    Page<UnitResponse> result = unitService.getPaginatedUnits(pageable, null);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getContent()).hasSize(1);
    verify(unitRepository).findAll(pageable);
    verify(unitRepository, never()).findByNameContainsIgnoreCase(any(), any());

    UnitResponse response = result.getContent().getFirst();
    assertThat(response.id()).isEqualTo(IdEncoder.encode(unit.getId()));
    assertThat(response.name()).isEqualTo(unit.getName());
  }

  @Test
  @DisplayName("should_ReturnFilteredUnits_When_FilterIsNotNull")
  void should_ReturnFilteredUnits_When_FilterIsNotNull() {
    // Arrange
    var filter = "test";
    var pageable = PageRequest.of(0, 10);
    var unit = new Unit("unit-1", "Test Unit", LocalDateTime.now(), LocalDateTime.now());
    Page<Unit> page = new PageImpl<>(List.of(unit));

    when(unitRepository.findByNameContainsIgnoreCase(eq(filter), eq(pageable))).thenReturn(page);

    // Act
    Page<UnitResponse> result = unitService.getPaginatedUnits(pageable, filter);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getContent()).hasSize(1);
    verify(unitRepository).findByNameContainsIgnoreCase(filter, pageable);
    verify(unitRepository, never()).findAll(any(Pageable.class));
  }
}
