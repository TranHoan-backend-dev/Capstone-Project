package com.capstone.device.application.usecase;

import com.capstone.device.application.business.usagehistory.UsageHistoryService;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.history.AnalysisRequest;
import com.capstone.device.application.dto.request.history.UsageHistoryRequest;
import com.capstone.device.application.dto.response.usagehistory.AnalysisResponse;
import com.capstone.device.application.dto.response.usagehistory.UsageResponse;
import com.capstone.device.infrastructure.service.GcsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsageHistoryUseCaseTest {

  @Mock
  WaterMeterService waterMeterService;
  @Mock
  UsageHistoryService usageHistoryService;
  @Mock
  GcsService gcsService;
  @Mock
  StringRedisTemplate redisTemplate;
  @Mock
  ValueOperations<String, String> valueOperations;

  @InjectMocks
  UsageHistoryUseCase usageHistoryUseCase;

  private static final String REDIS_KEY_PREFIX = "meter:image:url:";

  @Test
  void should_updateWaterIndex_When_ValidInput() {
    // Given
    var serial = "WM-001";
    var url = "http://gcs.com/image.png";
    var index = new BigDecimal("100.5");
    var date = LocalDate.now();
    var request = new UsageHistoryRequest(index, date);
    var expected = UsageResponse.builder().serial(serial).build();

    when(waterMeterService.isWaterMeterExisting(serial)).thenReturn(true);
    when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    when(valueOperations.get(REDIS_KEY_PREFIX + serial)).thenReturn(url);
    when(usageHistoryService.addWaterIndexOfThisMonth(url, serial, index, date)).thenReturn(expected);

    // When
    var result = usageHistoryUseCase.updateWaterIndex(request, serial);

    // Then
    assertNotNull(result);
    assertEquals(serial, result.serial());
    verify(waterMeterService).isWaterMeterExisting(serial);
    verify(redisTemplate).delete(REDIS_KEY_PREFIX + serial);
  }

  @Test
  void should_ThrowException_When_SerialDoesNotExist() {
    // Given
    var serial = "FAIL";
    var request = new UsageHistoryRequest(BigDecimal.TEN, LocalDate.now());
    when(waterMeterService.isWaterMeterExisting(serial)).thenReturn(false);

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> usageHistoryUseCase.updateWaterIndex(request, serial));
  }

  @Test
  void should_analysisTheMeterImage_WithSerial_When_Called() {
    // Given
    var serial = "WM-001";
    var url = "http://gcs.com/image.png";
    var file = mock(MultipartFile.class);
    var request = new AnalysisRequest(file, LocalDate.now());
    var expected = AnalysisResponse.builder().serial(serial).build();

    when(waterMeterService.isWaterMeterExisting(serial)).thenReturn(true);
    when(gcsService.upload(file)).thenReturn(url);
    when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    when(usageHistoryService.extractDataFromTheMeterImage(file)).thenReturn(expected);

    // When
    var result = usageHistoryUseCase.analysisTheMeterImageWithSerial(request, serial);

    // Then
    assertNotNull(result);
    assertEquals(serial, result.serial());
    verify(waterMeterService).isWaterMeterExisting(serial);
    verify(gcsService).upload(file);
    verify(valueOperations).set(eq(REDIS_KEY_PREFIX + serial), eq(url), any(Duration.class));
  }

  @Test
  void should_updatePaymentStatus_When_Called() {
    // Given
    var serial = "WM-001";
    var method = "BANKING";

    // When
    usageHistoryUseCase.updatePaymentStatus(serial, method);

    // Then
    verify(usageHistoryService).updatePaymentStatus(serial, method);
  }
}

