package com.capstone.device.application.usecase;

import com.capstone.device.application.business.watermeter.WaterMeterService;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.Collections;
import com.capstone.device.application.dto.response.water.OverallWaterMeterResponse;

@ExtendWith(MockitoExtension.class)
class WaterMeterUseCaseTest {

    @Mock
    WaterMeterService waterMeterService;

    @InjectMocks
    WaterMeterUseCase waterMeterUseCase;

    @Test
    void should_DeleteOverallWaterMeterByLateralId() {
        String id = "some-id";
        waterMeterUseCase.deleteOverallWaterMeterByLateralId(id);
        verify(waterMeterService).deleteOverallWaterMeterByLateralId(id);
    }

    @Test
    void should_GetAllOverallWaterMeters() {
        Pageable pageable = PageRequest.of(0, 10);
        String keyword = "test";
        Page<OverallWaterMeterResponse> expectedPage = new PageImpl<>(Collections.emptyList());
        when(waterMeterService.getAllOverallWaterMeters(pageable, keyword)).thenReturn(expectedPage);

        Page<OverallWaterMeterResponse> result = waterMeterUseCase.getAllOverallWaterMeters(pageable, keyword);

        assertEquals(expectedPage, result);
        verify(waterMeterService).getAllOverallWaterMeters(pageable, keyword);
    }

}
