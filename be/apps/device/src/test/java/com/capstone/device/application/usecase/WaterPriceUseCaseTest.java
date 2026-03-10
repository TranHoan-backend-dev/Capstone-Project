package com.capstone.device.application.usecase;

import com.capstone.device.application.business.waterprice.WaterPriceService;
import com.capstone.device.application.dto.request.price.CreateRequest;
import com.capstone.device.application.dto.request.price.UpdateRequest;
import com.capstone.device.application.dto.response.WaterPriceResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WaterPriceUseCaseTest {

    @Mock
    WaterPriceService waterPriceService;

    @InjectMocks
    WaterPriceUseCase waterPriceUseCase;

    @Test
    void should_CreatePrice_Success() {
        var request = new CreateRequest(null, null, null, null, null, null);
        var response = new WaterPriceResponse(null, null, null, null, null, null, null, null, null);
        when(waterPriceService.createWaterPrice(request)).thenReturn(response);

        var result = waterPriceUseCase.createPrice(request);

        assertThat(result).isNotNull();
    }

    @Test
    void should_UpdatePrice_Success() {
        var id = "id";
        var request = new UpdateRequest(null, null, null, null, null, null);
        var response = new WaterPriceResponse(id, null, null, null, null, null, null, null, null);
        when(waterPriceService.updateWaterPrice(id, request)).thenReturn(response);

        var result = waterPriceUseCase.updatePrice(id, request);

        assertThat(result.id()).isEqualTo(id);
    }

    @Test
    void should_DeletePrice_Success() {
        var id = "id";
        waterPriceUseCase.deletePrice(id);
        verify(waterPriceService).deleteWaterPrice(id);
    }

    @Test
    void should_GetPrice_Success() {
        var id = "id";
        var response = new WaterPriceResponse(id, null, null, null, null, null, null, null, null);
        when(waterPriceService.getWaterPriceById(id)).thenReturn(response);

        var result = waterPriceUseCase.getPrice(id);

        assertThat(result.id()).isEqualTo(id);
    }

    @Test
    void should_GetAllPrices_Success() {
        var pageable = Pageable.unpaged();
        var page = new PageImpl<WaterPriceResponse>(Collections.emptyList());
        when(waterPriceService.getAllWaterPrices(pageable, null)).thenReturn(page);

        var result = waterPriceUseCase.getAllPrices(pageable, null);

        assertThat(result.getContent()).isEmpty();
    }
}
