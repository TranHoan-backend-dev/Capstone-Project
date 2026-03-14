package com.capstone.device.application.usecase;

import com.capstone.device.application.business.watermeter.WaterMeterService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WaterMeterUseCaseTest {

    @Mock
    WaterMeterService waterMeterService;

    @InjectMocks
    WaterMeterUseCase waterMeterUseCase;

    @Test
    void should_ReturnTrue_When_Exists() {
        var id = "id";
        when(waterMeterService.isWaterMeterExisting(id)).thenReturn(true);

        var result = waterMeterUseCase.checkExistence(id);

        assertThat(result).isTrue();
    }

    @Test
    void should_ReturnFalse_When_NotExists() {
        var id = "id";
        when(waterMeterService.isWaterMeterExisting(id)).thenReturn(false);

        var result = waterMeterUseCase.checkExistence(id);

        assertThat(result).isFalse();
    }
}
