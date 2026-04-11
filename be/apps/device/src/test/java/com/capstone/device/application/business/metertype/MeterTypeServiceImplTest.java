package com.capstone.device.application.business.metertype;

import com.capstone.common.exception.ExistingException;
import com.capstone.device.application.dto.request.metertype.CreateRequest;
import com.capstone.device.application.dto.request.metertype.UpdateRequest;
import com.capstone.device.domain.model.WaterMeterType;
import com.capstone.device.infrastructure.persistence.WaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MeterTypeServiceImplTest {

  @Mock
  WaterMeterTypeRepository waterMeterTypeRepository;
  @Mock
  WaterMeterRepository waterMeterRepository;

  @InjectMocks
  MeterTypeServiceImpl meterTypeService;

  @Test
  void should_CreateMeterType_When_RequestIsValid() {
    // Given
    var request = new CreateRequest("Meter A", "Origin", "Model", 20, "1000", "Qn", "Qt", "Qmin", 15.5f);
    when(waterMeterTypeRepository.existsByNameIgnoreCase(anyString())).thenReturn(false);
    when(waterMeterTypeRepository.save(any(WaterMeterType.class))).thenAnswer(invocation -> {
      WaterMeterType mt = invocation.getArgument(0);
      ReflectionTestUtils.setField(mt, "typeId", "mt-id");
      return mt;
    });

    // When
    var response = meterTypeService.createMeterType(request);

    // Then
    assertThat(response.typeId()).isEqualTo("mt-id");
    assertThat(response.name()).isEqualTo("Meter A");
    verify(waterMeterTypeRepository).save(any());
  }

  @Test
  void should_ThrowException_When_CreateNameExists() {
    // Given
    var request = new CreateRequest("Existing", null, null, null, null, null, null, null, null);
    when(waterMeterTypeRepository.existsByNameIgnoreCase("Existing")).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> meterTypeService.createMeterType(request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessageContaining("already exists");
  }

  @Test
  void should_UpdateMeterType_When_Exists() {
    // Given
    var id = "id";
    var request = new UpdateRequest("New Name", null, null, 25, null, null, null, null, null);
    var existing = new WaterMeterType();
    ReflectionTestUtils.setField(existing, "name", "Old Name");

    when(waterMeterTypeRepository.findById(id)).thenReturn(Optional.of(existing));
    when(waterMeterTypeRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = meterTypeService.updateMeterType(id, request);

    // Then
    assertThat(response.name()).isEqualTo("New Name");
    assertThat(response.size()).isEqualTo(25);
  }

  @Test
  void should_DeleteMeterType_When_Valid() {
    // Given
    var id = "id";
    when(waterMeterTypeRepository.existsById(id)).thenReturn(true);
    when(waterMeterRepository.existsByType_TypeId(id)).thenReturn(false);

    // When
    meterTypeService.deleteMeterType(id);

    // Then
    verify(waterMeterTypeRepository).deleteById(id);
  }

  @Test
  void should_ThrowException_When_DeleteInUse() {
    // Given
    var id = "id";
    when(waterMeterTypeRepository.existsById(id)).thenReturn(true);
    when(waterMeterRepository.existsByType_TypeId(id)).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> meterTypeService.deleteMeterType(id))
      .isInstanceOf(ExistingException.class)
      .hasMessageContaining("in use");
  }

  @Test
  void should_GetAllMeterTypes_Success() {
    // Given
    var pageable = Pageable.unpaged();
    var entity = new WaterMeterType();
    ReflectionTestUtils.setField(entity, "name", "MT");
    var page = new PageImpl<>(List.of(entity));
    when(waterMeterTypeRepository.findAll(pageable)).thenReturn(page);

    // When
    var result = meterTypeService.getAllMeterTypes(pageable);

    // Then
    assertThat(result.content()).hasSize(1);
  }
}
