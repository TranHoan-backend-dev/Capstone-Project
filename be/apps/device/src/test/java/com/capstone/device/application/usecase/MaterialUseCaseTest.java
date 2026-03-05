package com.capstone.device.application.usecase;

import com.capstone.device.application.business.material.MaterialService;
import com.capstone.device.application.dto.request.material.CreateRequest;
import com.capstone.device.application.dto.request.material.UpdateRequest;
import com.capstone.device.application.dto.response.MaterialResponse;
import com.capstone.device.application.event.producer.MessageProducer;
import com.capstone.device.application.event.producer.material.DeleteEvent;
import com.capstone.device.application.event.producer.material.UpdateEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MaterialUseCaseTest {

  @Mock
  MaterialService mService;

  @Mock
  MessageProducer producer;

  @InjectMocks
  MaterialUseCase materialUseCase;

  private final String UPDATE_KEY = "construction_queue.material-price.update";
  private final String DELETE_KEY = "construction_queue.material-price.delete";

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(materialUseCase, "UPDATE_ROUTING_KEY", UPDATE_KEY);
    ReflectionTestUtils.setField(materialUseCase, "DELETE_ROUTING_KEY", DELETE_KEY);
  }

  @Test
  void should_ReturnResponse_When_CreateRequestIsValid() {
    // Given
    var request = new CreateRequest("L001", "Job 1",
        new BigDecimal("100"), new BigDecimal("50"),
        new BigDecimal("45"), new BigDecimal("20"),
        new BigDecimal("18"), "G1", "U1");

    var expectedResponse = new MaterialResponse("L001", "Job 1",
        new BigDecimal("100"), new BigDecimal("50"),
        new BigDecimal("45"), new BigDecimal("20"),
        new BigDecimal("18"), "Group 1",
        "Unit 1", LocalDateTime.now(), LocalDateTime.now());

    when(mService.createMaterial(request)).thenReturn(expectedResponse);

    // When
    var actualResponse = materialUseCase.create(request);

    // Then
    assertNotNull(actualResponse);
    assertEquals(expectedResponse.id(), actualResponse.id());
    verify(mService, times(1)).createMaterial(request);
  }

  @Test
  void should_UpdateAndSendEvent_When_MaterialExists() {
    // Given
    var id = "L001";
    var request = new UpdateRequest("Job New", new BigDecimal("110"), null, null, null, null, "G1", "U1");

    var oldResponse = new MaterialResponse(id, "Job Old",
        new BigDecimal("100"), new BigDecimal("50"),
        new BigDecimal("45"), new BigDecimal("20"),
        new BigDecimal("18"), "Group 1", "Unit 1",
        LocalDateTime.now(), LocalDateTime.now());

    var newResponse = new MaterialResponse(id, "Job New",
        new BigDecimal("110"), new BigDecimal("50"),
        new BigDecimal("45"), new BigDecimal("20"),
        new BigDecimal("18"), "Group 1", "Unit 1",
        LocalDateTime.now(), LocalDateTime.now());

    when(mService.getMaterialById(id)).thenReturn(oldResponse);
    when(mService.updateMaterial(eq(id), any(UpdateRequest.class))).thenReturn(newResponse);

    // When
    var result = materialUseCase.update(id, request);

    // Then
    assertNotNull(result);
    assertEquals("Job New", result.jobContent());
    verify(producer, times(1)).send(eq(UPDATE_KEY), any(UpdateEvent.class));
    verify(mService, times(1)).updateMaterial(eq(id), any(UpdateRequest.class));
  }

  @Test
  void should_ThrowException_When_UpdateNonExistentMaterial() {
    // Given
    var id = "NON_EXISTENT";
    var request = new UpdateRequest("Job New",
        new BigDecimal("110"), null, null,
        null, null, "G1", "U1");

    when(mService.getMaterialById(id)).thenThrow(new IllegalArgumentException("Material not found"));

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> materialUseCase.update(id, request));
    verify(mService, never()).updateMaterial(anyString(), any());
    verify(producer, never()).send(anyString(), any());
  }

  @Test
  void should_DeleteAndSendEvent_When_MaterialExists() {
    // Given
    var id = "L001";
    var oldResponse = new MaterialResponse(id, "Job Old",
        new BigDecimal("100"), new BigDecimal("50"),
        new BigDecimal("45"), new BigDecimal("20"),
        new BigDecimal("18"), "Group 1", "Unit 1",
        LocalDateTime.now(), LocalDateTime.now());

    when(mService.getMaterialById(id)).thenReturn(oldResponse);

    // When
    materialUseCase.delete(id);

    // Then
    verify(mService, times(1)).deleteMaterial(id);
    verify(producer, times(1)).send(eq(DELETE_KEY), any(DeleteEvent.class));
  }

  @Test
  void should_ThrowException_When_DeleteNonExistentMaterial() {
    // Given
    var id = "NON_EXISTENT";
    when(mService.getMaterialById(id)).thenThrow(new IllegalArgumentException("Material not found"));

    // When & Then
    assertThrows(IllegalArgumentException.class, () -> materialUseCase.delete(id));
    verify(mService, never()).deleteMaterial(anyString());
    verify(producer, never()).send(anyString(), any());
  }

  @Test
  void should_ReturnResponse_When_GetById() {
    // Given
    var id = "L001";
    var expected = new MaterialResponse(id, "Job 1", null, null,
      null, null, null,
      null, null, null, null);
    when(mService.getMaterialById(id)).thenReturn(expected);

    // When
    var actual = materialUseCase.get(id);

    // Then
    assertNotNull(actual);
    assertEquals(id, actual.id());

  @Test
  void should_ReturnAll_When_GetAll() {
    // Given
    var pageable = Pageable.unpaged();
    var expectedPage = new org.springframework.data.domain.PageImpl<MaterialResponse>(
        java.util.Collections.emptyList());
    when(mService.getAllMaterials(pageable)).thenReturn(expectedPage);

    // When
    var actualPage = materialUseCase.getAll(pageable);

    // Then
    assertNotNull(actualPage);
    verify(mService).getAllMaterials(pageable);
  }
}
