package com.capstone.device.application.usecase;

import com.capstone.device.application.business.watermeter.WaterMeterService;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class WaterMeterUseCaseTest {

    @Mock
    WaterMeterService waterMeterService;

    @InjectMocks
    WaterMeterUseCase waterMeterUseCase;

}
