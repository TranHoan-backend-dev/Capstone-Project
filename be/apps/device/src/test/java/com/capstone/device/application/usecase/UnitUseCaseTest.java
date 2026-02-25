package com.capstone.device.application.usecase;

import com.capstone.device.application.business.unit.UnitService;
import com.capstone.device.application.dto.response.UnitResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
  void should_ReturnPaginatedUnits_When_ValidInput() {
    // Given
    var pageable = Pageable.unpaged();
    var filter = "type_filter";
    var unitResponse = new UnitResponse("id", "name", LocalDate.now().toString(),
        LocalDate.now().toString());
    var page = new PageImpl<>(List.of(unitResponse));

    when(unitService.getPaginatedUnits(any(Pageable.class), anyString())).thenReturn(page);

    // When
    var result = unitUseCase.getUnits(pageable, filter);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getContent()).hasSize(1);
    assertThat(result.getContent().getFirst()).isEqualTo(unitResponse);
    verify(unitService).getPaginatedUnits(pageable, filter);
  }

  @Test
  void should_ReturnEmptyPage_When_NoDataFound() {
    // Given
    var pageable = Pageable.unpaged();
    var filter = "empty_filter";
    var page = new PageImpl<UnitResponse>(Collections.emptyList());

    when(unitService.getPaginatedUnits(any(Pageable.class), anyString())).thenReturn(page);

    // When
    var result = unitUseCase.getUnits(pageable, filter);

    // Then
    assertThat(result).isNotNull();
    assertThat(result.getContent()).isEmpty();
    verify(unitService).getPaginatedUnits(pageable, filter);
  }
}
