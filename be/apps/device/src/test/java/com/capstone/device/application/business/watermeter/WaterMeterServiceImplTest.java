package com.capstone.device.application.business.watermeter;

import com.capstone.device.application.dto.request.WaterMeterRequest;
import com.capstone.device.domain.model.WaterMeter;
import com.capstone.device.domain.model.WaterMeterType;
import com.capstone.device.infrastructure.persistence.OverallWaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WaterMeterServiceImplTest {

  @Mock
  WaterMeterRepository waterMeterRepository;
  @Mock
  WaterMeterTypeRepository waterMeterTypeRepository;
  @Mock
  OverallWaterMeterRepository overallWaterMeterRepository;

  @InjectMocks
  WaterMeterServiceImpl waterMeterService;

  @Test
  void should_CreateWaterMeter_When_Valid() {
    // Given
    var request = new WaterMeterRequest("meter-01", LocalDate.now(), 20, "type-id");
    var type = new WaterMeterType();
    ReflectionTestUtils.setField(type, "name", "Type A");

    when(waterMeterTypeRepository.findById("type-id")).thenReturn(Optional.of(type));
    when(waterMeterRepository.save(any(WaterMeter.class))).thenAnswer(invocation -> {
      WaterMeter m = invocation.getArgument(0);
      ReflectionTestUtils.setField(m, "id", "m-id");
      return m;
    });

    // When
    var response = waterMeterService.createWaterMeter(request);

    // Then
    assertThat(response.id()).isEqualTo("m-id");
    assertThat(response.typeName()).isEqualTo("Type A");
    verify(waterMeterRepository).save(any());
  }

  @Test
  void should_ThrowException_When_UpdateNotFound() {
    // Given
    var id = "id";
    var request = new WaterMeterRequest(null, null, 0, "type");
    when(waterMeterRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> waterMeterService.updateWaterMeter(id, request))
      .isExactlyInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void should_DeleteOverallWaterMeter_When_Exists() {
    // Given
    var lateralId = "lat-id";
    when(overallWaterMeterRepository.existsByLateralId(lateralId)).thenReturn(true);

    // When
    waterMeterService.deleteOverallWaterMeterByLateralId(lateralId);

    // Then
    verify(overallWaterMeterRepository).deleteByLateralId(lateralId);
  }

  @Test
  void should_NotDeleteOverallWaterMeter_When_NotExists() {
    // Given
    var lateralId = "lat-id";
    when(overallWaterMeterRepository.existsByLateralId(lateralId)).thenReturn(false);

    // When
    waterMeterService.deleteOverallWaterMeterByLateralId(lateralId);

    // Then
    verify(overallWaterMeterRepository, never()).deleteByLateralId(any());
  }

  @Test
  void should_GetAllWaterMeters_Success() {
    // Given
    var pageable = Pageable.unpaged();
    var meter = new WaterMeter();
    var page = new PageImpl<>(List.of(meter));
    when(waterMeterRepository.findAll(pageable)).thenReturn(page);

    // When
    var result = waterMeterService.getAllWaterMeters(pageable);

    // Then
    assertThat(result.getContent()).hasSize(1);
  }
}
