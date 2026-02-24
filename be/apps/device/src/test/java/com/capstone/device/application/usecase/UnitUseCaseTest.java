package com.capstone.device.application.usecase;

import com.capstone.device.application.business.unit.UnitService;
import com.capstone.device.application.dto.response.UnitResponse;
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
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnitUseCaseTest {
  @Mock
  UnitService unitService;

  @Mock
  Logger log;

  @InjectMocks
  UnitUseCase unitUseCase;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(unitUseCase, "log", log);
  }

  @Test
  @DisplayName("Should return paginated units when getUnits is called with valid input")
  void should_ReturnPaginatedUnits_When_GetUnitsIsCalledWithValidInput() {
    // Arrange
    var pageable = mock(Pageable.class);
    var filter = "filter";
    var unitResponse = new UnitResponse("id", "name", LocalDate.now().toString(),
      LocalDate.now().toString());
    Page<UnitResponse> page = new PageImpl<>(List.of(unitResponse));

    when(unitService.getPaginatedUnits(any(Pageable.class), anyString())).thenReturn(page);

    // Act
    Page<UnitResponse> result = unitUseCase.getUnits(pageable, filter);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getContent()).hasSize(1);
    assertThat(result.getContent().getFirst()).isEqualTo(unitResponse);
    verify(unitService).getPaginatedUnits(pageable, filter);
  }

  @Test
  @DisplayName("Should return empty page when getUnits is called and service returns empty")
  void should_ReturnEmptyPage_When_GetUnitsIsCalledAndServiceReturnsEmpty() {
    // Arrange
    var pageable = mock(Pageable.class);
    var filter = "filter";
    Page<UnitResponse> page = new PageImpl<>(Collections.emptyList());

    when(unitService.getPaginatedUnits(any(Pageable.class), anyString())).thenReturn(page);

    // Act
    Page<UnitResponse> result = unitUseCase.getUnits(pageable, filter);

    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getContent()).isEmpty();
    verify(unitService).getPaginatedUnits(pageable, filter);
  }
}
