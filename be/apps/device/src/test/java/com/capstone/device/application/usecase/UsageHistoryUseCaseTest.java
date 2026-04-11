package com.capstone.device.application.usecase;

import com.capstone.device.application.business.usagehistory.UsageHistoryService;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.history.AnalysisRequest;
import com.capstone.device.application.dto.request.history.UsageHistoryRequest;
import com.capstone.device.application.dto.response.usagehistory.AnalysisResponse;
import com.capstone.device.application.dto.response.usagehistory.UsageResponse;
import com.capstone.device.domain.model.utils.Usage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsageHistoryUseCaseTest {

  @Mock
  WaterMeterService waterMeterService;
  @Mock
  UsageHistoryService usageHistoryService;

  @InjectMocks
  UsageHistoryUseCase usageHistoryUseCase;

  @Test
  void should_updateWaterIndex_When_ValidInput() {
    // Given
    var serial = "WM-001";
    var index = new BigDecimal("100.5");
    var date = LocalDate.now();
    var request = new UsageHistoryRequest(index, date);
    var expected = UsageResponse.builder().serial(serial).build();

    when(waterMeterService.isWaterMeterExisting(serial)).thenReturn(true);

    var lastUsage = UsageResponse.builder()
      .serial(serial)
      .usagesList(List.of(Usage.builder()
        .status("PENDING")
        .build()))
      .build();

    when(usageHistoryService.getTheLatestUsageHistoryBySerial(serial)).thenReturn(lastUsage);
    when(usageHistoryService.updateUsageDetails(serial, date, index)).thenReturn(expected);

    // When
    var result = usageHistoryUseCase.updateWaterIndex(request, serial);

    // Then
    assertNotNull(result);
    assertEquals(serial, result.serial());
    verify(waterMeterService).isWaterMeterExisting(serial);
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
    var file = mock(MultipartFile.class);
    var request = new AnalysisRequest(file, LocalDate.now(), null);
    var expected = AnalysisResponse.builder().serial(serial).index("100").build();

    when(waterMeterService.isWaterMeterExisting(serial)).thenReturn(true);
    when(usageHistoryService.extractDataFromTheMeterImage(file)).thenReturn(expected);
    when(usageHistoryService.addWaterIndexOfThisMonth(any(), eq(serial), any(), any(), eq("PENDING"))).thenReturn(null);

    // When
    var result = usageHistoryUseCase.analysisTheMeterImageWithSerial(request, serial);

    // Then
    assertNotNull(result);
    assertEquals(serial, result.serial());
    verify(waterMeterService).isWaterMeterExisting(serial);
    verify(usageHistoryService).addWaterIndexOfThisMonth(any(), eq(serial), any(), any(), eq("PENDING"));
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

  @Test
  void should_resolveSerialFromCustomerId_When_AiFails() {
    // Given
    var customerId = "CUST-001";
    var serial = "WM-resolved";
    var file = mock(MultipartFile.class);
    var request = new AnalysisRequest(file, LocalDate.now(), customerId);

    // AI returns null serial
    var aiExpected = AnalysisResponse.builder().serial(null).index("100").build();
    when(usageHistoryService.extractDataFromTheMeterImage(file)).thenReturn(aiExpected);

    // Fallback: resolution from customer profile
    var customerUsage = UsageResponse.builder().serial(serial).build();
    when(usageHistoryService.getUsageHistoryByCustomerId(customerId)).thenReturn(customerUsage);

    // Final result
    when(usageHistoryService.addWaterIndexOfThisMonth(any(), eq(serial), any(), any(), eq("PENDING"))).thenReturn(null);

    // When
    var result = usageHistoryUseCase.analysisTheMeterImageWithSerial(request, null);

    // Then
    assertNotNull(result);
    // The AnalysisResponse returned still has serial=null (from AI), but the method was called with resolved serial
    verify(usageHistoryService).addWaterIndexOfThisMonth(any(), eq(serial), any(), any(), eq("PENDING"));
  }
}

