package com.capstone.device.application.usecase;

import com.capstone.device.application.business.metertype.MeterTypeService;
import com.capstone.device.application.dto.request.metertype.CreateRequest;
import com.capstone.device.application.dto.request.metertype.UpdateRequest;
import com.capstone.device.application.dto.response.PageResponse;
import com.capstone.device.application.dto.response.WaterMeterTypeResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MeterTypeUseCaseTest {

  @Mock
  MeterTypeService meterTypeService;

  @InjectMocks
  MeterTypeUseCase meterTypeUseCase;

  @Test
  void should_CreateMeterType_Success() {
    var request = new CreateRequest("Name", "Origin", "Model", 20, "1000", "Qn", "Qt", "Qmin", 15.0F);
    var response = new WaterMeterTypeResponse(null, "Name", null, null, null, null, null, null, null, null, null,
      null);
    when(meterTypeService.createMeterType(request)).thenReturn(response);

    var result = meterTypeUseCase.createMeterType(request);

    assertThat(result.name()).isEqualTo("Name");
  }

  @Test
  void should_UpdateMeterType_Success() {
    var id = "id";
    var request = new UpdateRequest("New", null, null, null, null, null, null, null, null);
    var response = new WaterMeterTypeResponse(id, "New", null, null, null, null, null, null, null, null, null,
      null);
    when(meterTypeService.updateMeterType(id, request)).thenReturn(response);

    var result = meterTypeUseCase.updateMeterType(id, request);

    assertThat(result.name()).isEqualTo("New");
  }

  @Test
  void should_DeleteMeterType_Success() {
    var id = "id";
    meterTypeUseCase.deleteMeterType(id);
    verify(meterTypeService).deleteMeterType(id);
  }

  @Test
  void should_GetMeterType_Success() {
    var id = "id";
    var response = new WaterMeterTypeResponse(id, "Name", null, null, null, null, null, null, null, null, null,
      null);
    when(meterTypeService.getMeterTypeById(id)).thenReturn(response);

    var result = meterTypeUseCase.getMeterTypeById(id);

    assertThat(result.typeId()).isEqualTo(id);
  }

  @Test
  void should_GetAllMeterTypes_Success() {
    var pageable = Pageable.unpaged();
    var response = new PageResponse<WaterMeterTypeResponse>(Collections.emptyList(), 0, 1, 0, 0, true);
    when(meterTypeService.getAllMeterTypes(pageable)).thenReturn(response);

    var result = meterTypeUseCase.getAllMeterTypes(pageable);

    assertThat(result.content()).isEmpty();
  }
}
