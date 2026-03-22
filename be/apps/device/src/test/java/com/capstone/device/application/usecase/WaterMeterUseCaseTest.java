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

}
