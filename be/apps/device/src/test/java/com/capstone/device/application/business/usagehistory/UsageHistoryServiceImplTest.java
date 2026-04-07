package com.capstone.device.application.business.usagehistory;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.device.application.dto.response.customer.CustomerWaterPriceRefResponse;
import com.capstone.device.domain.model.UsageHistory;
import com.capstone.device.domain.model.WaterMeter;
import com.capstone.device.domain.model.WaterPrice;
import com.capstone.device.domain.model.utils.Usage;
import com.capstone.device.infrastructure.persistence.UsageHistoryRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterPriceRepository;
import com.capstone.device.infrastructure.service.CustomerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsageHistoryServiceImplTest {

  @Mock
  UsageHistoryRepository repository;
  @Mock
  WaterMeterRepository waterMeterRepository;
  @Mock
  WaterPriceRepository waterPriceRepository;
  @Mock
  CustomerService customerService;
  @Mock
  WaterChargeCalculator waterChargeCalculator;
  @Mock
  ObjectMapper objectMapper;

  @InjectMocks
  UsageHistoryServiceImpl service;

  private WaterMeter meter;
  private UsageHistory history;
  private WaterPrice price;

  @BeforeEach
  void setUp() {
    meter = WaterMeter.create(builder -> builder.id("WM-001"));
    history = UsageHistory.builder()
      .usageHistory("WM-001")
      .meter(meter)
      .usages(new ArrayList<>())
      .customerId("CUST-001")
      .build();
    price = WaterPrice.create(builder -> builder
      .priceId("PRICE-001")
      .priceTypes(new ArrayList<>())
      .tax(BigDecimal.ZERO)
      .environmentPrice(BigDecimal.ZERO));
  }

  @Test
  void should_addWaterIndexOfThisMonth_When_HistoryFound() {
    // Given
    Object data = new Object();
    var wrappedCustomer = new WrapperApiResponse(200, "Success", data, OffsetDateTime.now());
    var customerInfo = new CustomerWaterPriceRefResponse("CUST-001", "Hoàn", "PRICE-001", "RM-001", "Serial-001", "Addr-001");

    when(waterMeterRepository.findWaterMeterById("WM-001")).thenReturn(meter);
    when(repository.findByMeter(meter)).thenReturn(Optional.of(history));
    when(customerService.getCustomerIdByMeterId("WM-001")).thenReturn("CUST-001");
    when(customerService.getCustomerById("CUST-001")).thenReturn(wrappedCustomer);
    when(objectMapper.convertValue(any(), eq(CustomerWaterPriceRefResponse.class))).thenReturn(customerInfo);
    when(waterPriceRepository.findById("PRICE-001")).thenReturn(Optional.of(price));

    WaterChargeBreakdown breakdown = new WaterChargeBreakdown(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO,
      BigDecimal.ZERO);
    when(waterChargeCalculator.calculateProgressiveCharge(any(), any())).thenReturn(breakdown);
    when(repository.save(any())).thenReturn(history);

    // When
    var response = service.addWaterIndexOfThisMonth("url", "WM-001", BigDecimal.TEN, LocalDate.now(), "PENDING");

    // Then
    assertNotNull(response);
    verify(repository).save(any());
  }

  @Test
  void should_ThrowException_When_IndexIsInvalid() {
    // Given
    history.getUsages()
      .add(Usage.builder().index(new BigDecimal("100")).recordingDate(LocalDate.now().minusDays(1)).build());

    when(waterMeterRepository.findWaterMeterById("WM-001")).thenReturn(meter);
    when(repository.findByMeter(meter)).thenReturn(Optional.of(history));

    // When & Then - New index (50) < Previous index (100)
    assertThrows(IllegalArgumentException.class,
      () -> service.addWaterIndexOfThisMonth("url", "WM-001", new BigDecimal("50"), LocalDate.now(), "PENDING"));
  }

  @Test
  void should_updatePaymentStatus_When_Exists() {
    // Given
    var latest = Usage.builder().recordingDate(LocalDate.now()).isPaid(false).build();
    history.getUsages().add(latest);
    when(waterMeterRepository.findWaterMeterById("WM-001")).thenReturn(meter);
    when(repository.findByMeter(meter)).thenReturn(Optional.of(history));

    // When
    service.updatePaymentStatus("WM-001", "CASH");

    // Then
    assertTrue(latest.getIsPaid());
    assertEquals("CASH", latest.getPaymentMethod());
    verify(repository).save(history);
  }
}
