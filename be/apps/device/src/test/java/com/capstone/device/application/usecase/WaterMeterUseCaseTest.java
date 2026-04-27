package com.capstone.device.application.usecase;

import com.capstone.device.application.business.watermeter.WaterMeterService;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;

import com.capstone.device.application.dto.response.water.OverallWaterMeterResponse;

@ExtendWith(MockitoExtension.class)
class WaterMeterUseCaseTest {

  @Mock
  WaterMeterService waterMeterService;

  @InjectMocks
  WaterMeterUseCase waterMeterUseCase;

  @Test
  void should_DeleteOverallWaterMeterByLateralId() {
    var id = "some-id";
    waterMeterUseCase.deleteOverallWaterMeterByLateralId(id);
    verify(waterMeterService).deleteOverallWaterMeterByLateralId(id);
  }

  @Test
  void should_GetAllOverallWaterMeters() {
    var pageable = PageRequest.of(0, 10);
    var keyword = "test";
    Page<OverallWaterMeterResponse> expectedPage = new PageImpl<>(Collections.emptyList());
    when(waterMeterService.getAllOverallWaterMeters(pageable, keyword)).thenReturn(expectedPage);

    var result = waterMeterUseCase.getAllOverallWaterMeters(pageable, keyword);

    assertEquals(expectedPage, result);
    verify(waterMeterService).getAllOverallWaterMeters(pageable, keyword);
  }

  @Test
  void should_GetAllOverallWaterMeters_WithNullKeyword() {
    var pageable = PageRequest.of(0, 10);
    when(waterMeterService.getAllOverallWaterMeters(pageable, null)).thenReturn(new PageImpl<>(Collections.emptyList()));

    waterMeterUseCase.getAllOverallWaterMeters(pageable, null);

    verify(waterMeterService).getAllOverallWaterMeters(pageable, null);
  }
}
