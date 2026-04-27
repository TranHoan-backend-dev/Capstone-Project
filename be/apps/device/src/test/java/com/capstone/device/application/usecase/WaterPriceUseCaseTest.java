package com.capstone.device.application.usecase;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.device.application.business.waterprice.WaterPriceService;
import com.capstone.device.application.dto.request.price.CreateRequest;
import com.capstone.device.application.dto.request.price.UpdateRequest;
import com.capstone.device.application.dto.response.water.WaterPriceResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.infrastructure.util.Message;
import com.capstone.device.infrastructure.service.CustomerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WaterPriceUseCaseTest {

  @Mock
  WaterPriceService waterPriceService;

  @Mock
  MessageProducer producer;

  @Mock
  CustomerService customerService;

  @InjectMocks
  WaterPriceUseCase waterPriceUseCase;

  private final String UPDATE_KEY = "update-key";
  private final String DELETE_KEY = "delete-key";

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(waterPriceUseCase, "UPDATE_ROUTING_KEY", UPDATE_KEY);
    ReflectionTestUtils.setField(waterPriceUseCase, "DELETE_ROUTING_KEY", DELETE_KEY);
  }

  @Test
  void should_getPricesList_When_ValidParams() {
    // Given
    var pageable = mock(Pageable.class);
    var filter = LocalDate.now();
    Page<WaterPriceResponse> expectedPage = new PageImpl<>(List.of());
    when(waterPriceService.getAllWaterPrices(pageable, filter)).thenReturn(expectedPage);

    // When
    var result = waterPriceUseCase.getPricesList(pageable, filter);

    // Then
    assertThat(result).isEqualTo(expectedPage);
    verify(waterPriceService).getAllWaterPrices(pageable, filter);
  }

  @Test
  void should_createWaterPrice_When_ValidRequest() {
    // Given
    var request = new CreateRequest(null, BigDecimal.TEN, BigDecimal.ONE, LocalDate.now(),
      LocalDate.now().plusDays(1), "Desc");
    var expectedResponse = mock(WaterPriceResponse.class);
    when(waterPriceService.createWaterPrice(request)).thenReturn(expectedResponse);

    // When
    var result = waterPriceUseCase.createWaterPrice(request);

    // Then
    assertThat(result).isEqualTo(expectedResponse);
    verify(waterPriceService).createWaterPrice(request);
  }

  @Test
  void should_updateWaterPrice_When_ValidRequest() {
    // Given
    var id = "some-id";
    var request = new UpdateRequest(null, BigDecimal.TEN, BigDecimal.ONE, LocalDate.now(),
      LocalDate.now().plusDays(1), "New Desc");

    var oldPrice = new WaterPriceResponse(id, "DOMESTIC", BigDecimal.valueOf(5), BigDecimal.ZERO,
      LocalDate.now().minusDays(10), LocalDate.now().plusDays(10), "Old Desc", LocalDateTime.now(),
      LocalDateTime.now());
    var newPrice = new WaterPriceResponse(id, "DOMESTIC", BigDecimal.TEN, BigDecimal.ONE,
      LocalDate.now(), LocalDate.now().plusDays(1), "New Desc", LocalDateTime.now(), LocalDateTime.now());

    when(waterPriceService.getWaterPriceById(id)).thenReturn(oldPrice);
    when(waterPriceService.updateWaterPrice(id, request)).thenReturn(newPrice);

    // When
    var result = waterPriceUseCase.updateWaterPrice(id, request);

    // Then
    assertThat(result).isEqualTo(newPrice);
    verify(waterPriceService).getWaterPriceById(id);
    verify(waterPriceService).updateWaterPrice(id, request);
    verify(producer).send(eq(UPDATE_KEY), any());
  }

  @Test
  void should_deleteWaterPrice_When_NotAppliedToCustomers() {
    // Given
    var id = "some-id";
    var apiResponse = new WrapperApiResponse(200, "Success", "false", OffsetDateTime.now());
    var oldPrice = new WaterPriceResponse(id, "DOMESTIC", BigDecimal.valueOf(5), BigDecimal.ZERO,
      LocalDate.now().minusDays(10), LocalDate.now().plusDays(10), "Old Desc", LocalDateTime.now(),
      LocalDateTime.now());

    when(customerService.checkWhetherCustomersAreApplied(id)).thenReturn(apiResponse);
    when(waterPriceService.getWaterPriceById(id)).thenReturn(oldPrice);

    // When
    waterPriceUseCase.deleteWaterPrice(id);

    // Then
    verify(customerService).checkWhetherCustomersAreApplied(id);
    verify(waterPriceService).deleteWaterPrice(id);
    verify(producer).send(eq(DELETE_KEY), any());
  }

  @Test
  void should_throwException_When_deleteWaterPrice_AndAppliedToCustomers() {
    // Given
    var id = "some-id";
    var apiResponse = new WrapperApiResponse(200, "Success", "true", OffsetDateTime.now());
    when(customerService.checkWhetherCustomersAreApplied(id)).thenReturn(apiResponse);

    // When & Then
    assertThatThrownBy(() -> waterPriceUseCase.deleteWaterPrice(id))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage(Message.ENT_48);

    verify(customerService).checkWhetherCustomersAreApplied(id);
    verify(waterPriceService, never()).deleteWaterPrice(id);
  }

  @Test
  void should_getWaterPriceById_When_IdExists() {
    // Given
    var id = "some-id";
    var expectedResponse = mock(WaterPriceResponse.class);
    when(waterPriceService.getWaterPriceById(id)).thenReturn(expectedResponse);

    // When
    var result = waterPriceUseCase.getWaterPriceById(id);

    // Then
    assertThat(result).isEqualTo(expectedResponse);
    verify(waterPriceService).getWaterPriceById(id);
  }
}
