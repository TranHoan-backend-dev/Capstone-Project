package com.capstone.device.application.usecase;

import com.capstone.device.application.business.parameter.ParameterService;
import com.capstone.device.application.dto.request.UpdateParameterRequest;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.application.event.producer.parameter.ParameterUpdateEvent;
import org.junit.jupiter.api.BeforeEach;
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

import java.math.BigDecimal;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParameterUseCaseTest {

  @Mock
  ParameterService parameterService;

  @Mock
  MessageProducer messageProducer;

  @Mock
  Logger log;

  @InjectMocks
  ParameterUseCase parameterUseCase;

  private static final String UPDATE_ROUTING_KEY = "construction_queue.params.update";

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(parameterUseCase, "log", log);
    ReflectionTestUtils.setField(parameterUseCase, "UPDATE_ROUTING_KEY", UPDATE_ROUTING_KEY);
  }

  @Test
  void should_ReturnParameters_When_GetParametersListIsCalled() {
    var pageable = mock(Pageable.class);
    var filter = "test";
    Page<ParameterResponse> expectedPage = new PageImpl<>(Collections.emptyList());
    when(parameterService.getParameters(pageable, filter)).thenReturn(expectedPage);

    Page<ParameterResponse> result = parameterUseCase.getParametersList(pageable, filter);

    assertEquals(expectedPage, result);
  }

  @Test
  void should_UpdateParameterAndSendEvent_When_ValidRequest() {
    var id = "1";
    var updatorId = "admin-uuid";
    var request = new UpdateParameterRequest("VAT", new BigDecimal("0.08"));
    var oldData = new ParameterResponse(id, "VAT", "0.1", "Admin", "Admin", "2023-01-01", "2023-01-01");
    var newData = new ParameterResponse(id, "VAT", "0.08", "Admin", "Admin", "2023-01-01", "2023-01-02");

    when(parameterService.getParameterById(id)).thenReturn(oldData);
    when(parameterService.updateParameter(updatorId, id, request)).thenReturn(newData);

    var result = parameterUseCase.updateParameter(updatorId, id, request);

    assertEquals(newData, result);
    verify(log).info("UseCase: Updating parameter with id: {}", id);
    verify(messageProducer).send(eq(UPDATE_ROUTING_KEY), any(ParameterUpdateEvent.class));
  }
}
