package com.capstone.device.application.business.waterprice;

import com.capstone.common.enumerate.UsageTarget;
import com.capstone.common.exception.ExistingException;
import com.capstone.device.application.dto.request.price.CreateRequest;
import com.capstone.device.application.dto.request.price.UpdateRequest;
import com.capstone.device.domain.model.WaterPrice;
import com.capstone.device.infrastructure.persistence.WaterPriceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WaterPriceServiceImplTest {
  @Mock
  WaterPriceRepository waterPriceRepository;
  @InjectMocks
  WaterPriceServiceImpl waterPriceService;

  @Test
  void should_createWaterPrice_Success() {
    // Given
    var request = new CreateRequest(UsageTarget.DOMESTIC, BigDecimal.TEN, BigDecimal.ONE,
      LocalDate.now(), LocalDate.now().plusDays(30), "Policy A");
    var saved = new WaterPrice();
    ReflectionTestUtils.setField(saved, "priceId", "wp-123");
    ReflectionTestUtils.setField(saved, "usageTarget", UsageTarget.DOMESTIC);

    when(waterPriceRepository.save(any(WaterPrice.class))).thenReturn(saved);

    // When
    var result = waterPriceService.createWaterPrice(request);

    // Then
    assertThat(result.id()).isEqualTo("wp-123");
    assertThat(result.usageTarget()).isEqualTo("DOMESTIC");
    verify(waterPriceRepository).save(any(WaterPrice.class));
  }

  @Test
  void should_updateWaterPrice_Success() {
    // Given
    var id = "wp-123";
    var request = new UpdateRequest(UsageTarget.DOMESTIC, BigDecimal.valueOf(15), BigDecimal.valueOf(2),
      LocalDate.now(), LocalDate.now().plusDays(60), "New Policy");
    var existing = new WaterPrice();
    ReflectionTestUtils.setField(existing, "priceId", id);
    ReflectionTestUtils.setField(existing, "usageTarget", UsageTarget.DOMESTIC);
    ReflectionTestUtils.setField(existing, "description", "Old Policy");

    when(waterPriceRepository.findById(id)).thenReturn(Optional.of(existing));
    when(waterPriceRepository.existsByDescription("New Policy")).thenReturn(false);
    when(waterPriceRepository.save(any(WaterPrice.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var result = waterPriceService.updateWaterPrice(id, request);

    // Then
    assertThat(result.usageTarget()).isEqualTo("BUSINESS");
    assertThat(result.description()).isEqualTo("New Policy");
    assertThat(result.tax()).isEqualByComparingTo(BigDecimal.valueOf(15));
    verify(waterPriceRepository).save(existing);
  }

  @Test
  void should_updateWaterPrice_ThrowException_WhenDescriptionExists() {
    // Given
    var id = "wp-123";
    var request = new UpdateRequest(null, null, null, null, null, "Existing Policy");
    var existing = new WaterPrice();
    ReflectionTestUtils.setField(existing, "description", "Old Policy");

    when(waterPriceRepository.findById(id)).thenReturn(Optional.of(existing));
    when(waterPriceRepository.existsByDescription("Existing Policy")).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> waterPriceService.updateWaterPrice(id, request))
      .isInstanceOf(ExistingException.class)
      .hasMessageContaining("already exists");
  }

  @Test
  void should_updateWaterPrice_ThrowException_WhenNotFound() {
    // Given
    var id = "invalid";
    when(waterPriceRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> waterPriceService.updateWaterPrice(id, new UpdateRequest(null, null, null, null, null, null)))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void should_deleteWaterPrice_Success() {
    // Given
    var id = "wp-123";
    when(waterPriceRepository.existsById(id)).thenReturn(true);

    // When
    waterPriceService.deleteWaterPrice(id);

    // Then
    verify(waterPriceRepository).deleteById(id);
  }

  @Test
  void should_deleteWaterPrice_ThrowException_WhenNotFound() {
    // Given
    var id = "invalid";
    when(waterPriceRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> waterPriceService.deleteWaterPrice(id))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void should_getWaterPriceById_Success() {
    // Given
    var id = "wp-123";
    var wp = new WaterPrice();
    ReflectionTestUtils.setField(wp, "priceId", id);
    when(waterPriceRepository.findById(id)).thenReturn(Optional.of(wp));

    // When
    var result = waterPriceService.getWaterPriceById(id);

    // Then
    assertThat(result.id()).isEqualTo(id);
  }

  @Test
  void should_getWaterPriceById_ThrowException_WhenNotFound() {
    // Given
    var id = "invalid";
    when(waterPriceRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> waterPriceService.getWaterPriceById(id))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void should_getAllWaterPrices_NoFilter() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var pageContent = List.of(new WaterPrice());
    Page<WaterPrice> page = new PageImpl<>(pageContent, pageable, 1);
    when(waterPriceRepository.findAll(pageable)).thenReturn(page);

    // When
    var result = waterPriceService.getAllWaterPrices(pageable, null);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(waterPriceRepository).findAll(pageable);
  }

  @Test
  void should_getAllWaterPrices_WithFilter() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var filterDate = LocalDate.now();
    var pageContent = List.of(new WaterPrice());
    Page<WaterPrice> page = new PageImpl<>(pageContent, pageable, 1);
    when(waterPriceRepository.findAllByApplicationPeriodOrExpirationDate(filterDate, filterDate, pageable)).thenReturn(page);

    // When
    var result = waterPriceService.getAllWaterPrices(pageable, filterDate);

    // Then
    assertThat(result.getContent()).hasSize(1);
    verify(waterPriceRepository).findAllByApplicationPeriodOrExpirationDate(filterDate, filterDate, pageable);
  }
}
