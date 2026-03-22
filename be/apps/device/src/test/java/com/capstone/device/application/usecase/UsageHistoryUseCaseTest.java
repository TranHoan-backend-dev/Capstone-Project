package com.capstone.device.application.usecase;

import com.capstone.device.application.business.usagehistory.UsageHistoryService;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.UsageHistoryRequest;
import com.capstone.device.application.dto.response.pricetype.UsageResponse;
import com.capstone.device.infrastructure.service.GcsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsageHistoryUseCaseTest {

  @Mock
  WaterMeterService waterMeterService;
  @Mock
  UsageHistoryService usageHistoryService;
  @Mock
  GcsService gcsService;

  @InjectMocks
  UsageHistoryUseCase usageHistoryUseCase;

  @Test
  void should_updateWaterIndex_When_ValidInput() {
    // Given
    String serial = "WM-001";
    String url = "http://gcs.com/image.png";
    BigDecimal index = new BigDecimal("100.5");
    LocalDate date = LocalDate.now();
    MultipartFile file = mock(MultipartFile.class);
    UsageHistoryRequest request = new UsageHistoryRequest(file, index, date);
    UsageResponse expected = UsageResponse.builder().serial(serial).build();

    when(waterMeterService.isWaterMeterExisting(serial)).thenReturn(true);
    when(gcsService.upload(file)).thenReturn(url);
    when(usageHistoryService.addWaterIndexOfThisMonth(url, serial, index, date)).thenReturn(expected);

    // When
    UsageResponse result = usageHistoryUseCase.updateWaterIndex(request, serial);

    // Then
    assertNotNull(result);
    assertEquals(serial, result.serial());
    verify(waterMeterService).isWaterMeterExisting(serial);
    verify(gcsService).upload(file);
  }

  @Test
  void should_ThrowException_When_SerialDoesNotExist() {
    // Given
    String serial = "FAIL";
    UsageHistoryRequest request = new UsageHistoryRequest(mock(MultipartFile.class), BigDecimal.TEN, LocalDate.now());
    when(waterMeterService.isWaterMeterExisting(serial)).thenReturn(false);

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> usageHistoryUseCase.updateWaterIndex(request, serial));
  }

  @Test
  void should_updatePaymentStatus_When_Called() {
    // Given
    String serial = "WM-001";
    String method = "BANKING";

    // When
    usageHistoryUseCase.updatePaymentStatus(serial, method);

    // Then
    verify(usageHistoryService).updatePaymentStatus(serial, method);
  }
}
