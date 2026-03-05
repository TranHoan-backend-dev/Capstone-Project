package com.capstone.device.application.business.waterprice;

import com.capstone.common.exception.ExistingException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.device.application.dto.request.price.CreateRequest;
import com.capstone.device.application.dto.request.price.UpdateRequest;
import com.capstone.device.domain.model.UsageTarget;
import com.capstone.device.domain.model.WaterPrice;
import com.capstone.device.infrastructure.persistence.WaterPriceRepository;
import com.capstone.device.infrastructure.service.EmployeeService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WaterPriceServiceImplTest {

    @Mock
    WaterPriceRepository waterPriceRepository;
    @Mock
    EmployeeService empSrv;
    @Mock
    Logger log;

    @InjectMocks
    WaterPriceServiceImpl waterPriceService;

    @Test
    void should_CreateWaterPrice_When_Valid() {
        // Given
        var request = new CreateRequest(UsageTarget.RESIDENT.name(), BigDecimal.valueOf(10), BigDecimal.valueOf(5),
                LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31), "Description");

        when(waterPriceRepository.save(any(WaterPrice.class))).thenAnswer(invocation -> {
            WaterPrice wp = invocation.getArgument(0);
            ReflectionTestUtils.setField(wp, "priceId", "wp-id");
            return wp;
        });

        // When
        var response = waterPriceService.createWaterPrice(request);

        // Then
        assertThat(response.id()).isEqualTo("wp-id");
        assertThat(response.usageTarget()).isEqualTo(UsageTarget.RESIDENT.name());
        verify(waterPriceRepository).save(any());
    }

    @Test
    void should_UpdateWaterPrice_When_Exists() {
        // Given
        var id = "id";
        var request = new UpdateRequest(UsageTarget.ADMINISTRATIVE_NON_BUSINESS.name(), null, null, null, null,
                "New Desc");
        var existing = new WaterPrice();
        ReflectionTestUtils.setField(existing, "priceId", id);
        ReflectionTestUtils.setField(existing, "usageTarget", UsageTarget.RESIDENT);

        when(waterPriceRepository.findById(id)).thenReturn(Optional.of(existing));
        when(waterPriceRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        var response = waterPriceService.updateWaterPrice(id, request);

        // Then
        assertThat(response.usageTarget()).isEqualTo(UsageTarget.ADMINISTRATIVE_NON_BUSINESS.name());
        assertThat(response.description()).isEqualTo("New Desc");
    }

    @Test
    void should_DeleteWaterPrice_When_Valid() {
        // Given
        var id = "id";
        when(waterPriceRepository.existsById(id)).thenReturn(true);
        when(empSrv.areEmployeesAppliedThisWaterPrice(id)).thenReturn(
                new WrapperApiResponse(200, "OK", false, LocalDateTime.now()));

        // When
        waterPriceService.deleteWaterPrice(id);

        // Then
        verify(waterPriceRepository).deleteById(id);
    }

    @Test
    void should_ThrowException_When_DeleteInUse() {
        // Given
        var id = "id";
        when(waterPriceRepository.existsById(id)).thenReturn(true);
        when(empSrv.areEmployeesAppliedThisWaterPrice(id)).thenReturn(
                new WrapperApiResponse(200, "OK", true, LocalDateTime.now()));

        // When & Then
        assertThatThrownBy(() -> waterPriceService.deleteWaterPrice(id))
                .isInstanceOf(ExistingException.class)
                .hasMessageContaining("is still applying");
    }

    @Test
    void should_GetAllWaterPrices_WithKeyword() {
        // Given
        var pageable = Pageable.unpaged();
        var keyword = LocalDate.of(2023, 1, 1);
        var entity = new WaterPrice();
        var page = new PageImpl<>(List.of(entity));
        when(waterPriceRepository.findAllByApplicationPeriodOrExpirationDate(keyword, keyword, pageable))
                .thenReturn(page);

        // When
        var result = waterPriceService.getAllWaterPrices(pageable, keyword);

        // Then
        assertThat(result.getContent()).hasSize(1);
        verify(waterPriceRepository).findAllByApplicationPeriodOrExpirationDate(keyword, keyword, pageable);
    }

    @Test
    void should_ReturnNullUsageTarget_When_TargetIsNull() {
        // Given
        var id = "id";
        var wp = new WaterPrice();
        ReflectionTestUtils.setField(wp, "usageTarget", null);
        when(waterPriceRepository.findById(id)).thenReturn(Optional.of(wp));

        // When
        var response = waterPriceService.getWaterPriceById(id);

        // Then
        assertThat(response.usageTarget()).isNull();
    }
}
