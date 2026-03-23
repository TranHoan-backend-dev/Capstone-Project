package com.capstone.device.application.usecase;

import com.capstone.device.application.business.unit.UnitService;
import com.capstone.device.application.dto.request.unit.CreateUnitRequest;
import com.capstone.device.application.dto.request.UpdateUnitRequest;
import com.capstone.device.application.dto.response.UnitResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.application.event.producer.unit.UnitDeleteEvent;
import com.capstone.device.application.event.producer.unit.UnitUpdateEvent;
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

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnitUseCaseTest {

  @Mock
  UnitService unitService;

  @Mock
  MessageProducer messageProducer;

  @Mock
  Logger log;

  @InjectMocks
  UnitUseCase unitUseCase;

  private static final String UPDATE_ROUTING_KEY = "construction_queue.calculation-unit.update";
  private static final String DELETE_ROUTING_KEY = "construction_queue.calculation-unit.delete";

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(unitUseCase, "log", log);
    ReflectionTestUtils.setField(unitUseCase, "UPDATE_ROUTING_KEY", UPDATE_ROUTING_KEY);
    ReflectionTestUtils.setField(unitUseCase, "DELETE_ROUTING_KEY", DELETE_ROUTING_KEY);
  }

  @Test
  void should_ReturnPaginatedUnits_When_GetUnitsIsCalled() {
    var pageable = mock(Pageable.class);
    var filter = "test";
    Page<UnitResponse> expectedPage = new PageImpl<>(Collections.emptyList());
    when(unitService.getPaginatedUnits(pageable, filter)).thenReturn(expectedPage);

    Page<UnitResponse> result = unitUseCase.getUnits(pageable, filter);

    assertEquals(expectedPage, result);
    verify(log).info("Get units using filter: {}", filter);
  }

  @Test
  void should_CreateUnit_When_ValidRequest() {
    var request = new CreateUnitRequest("Unit 1");
    var expectedResponse = new UnitResponse("1", "Unit 1", "2023-01-01", "2023-01-01");
    when(unitService.createUnit(request)).thenReturn(expectedResponse);

    var result = unitUseCase.createUnit(request);

    assertEquals(expectedResponse, result);
    verify(log).info("UseCase: Creating unit: {}", "Unit 1");
  }

  @Test
  void should_UpdateUnitAndSendEvent_When_ValidRequest() {
    var id = "1";
    var request = new UpdateUnitRequest("New Name");
    UnitResponse oldData = new UnitResponse(id, "Old Name", "2023-01-01", "2023-01-01");
    UnitResponse newData = new UnitResponse(id, "New Name", "2023-01-01", "2023-01-02");

    when(unitService.getUnitById(id)).thenReturn(oldData);
    when(unitService.updateUnit(id, request)).thenReturn(newData);

    var result = unitUseCase.updateUnit(id, request);

    assertEquals(newData, result);
    verify(log).info("UseCase: Updating unit with id: {}", id);
    verify(messageProducer).send(eq(UPDATE_ROUTING_KEY), any(UnitUpdateEvent.class));
  }

  @Test
  void should_DeleteUnitAndSendEvent_When_ValidId() {
    var id = "1";
    var oldData = new UnitResponse(id, "To Delete", "2023-01-01", "2023-01-01");

    when(unitService.getUnitById(id)).thenReturn(oldData);
    doNothing().when(unitService).deleteUnit(id);

    unitUseCase.deleteUnit(id);

    verify(log).info("UseCase: Deleting unit with id: {}", id);
    verify(unitService).deleteUnit(id);
    verify(messageProducer).send(eq(DELETE_ROUTING_KEY), any(UnitDeleteEvent.class));
  }
}
