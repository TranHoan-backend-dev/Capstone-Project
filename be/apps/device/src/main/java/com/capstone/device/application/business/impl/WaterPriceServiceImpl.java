package com.capstone.device.application.business.impl;

import com.capstone.device.application.business.boundary.WaterPriceService;
import com.capstone.device.application.dto.request.WaterPriceRequest;
import com.capstone.device.application.dto.response.WaterPriceResponse;
import com.capstone.device.domain.model.WaterPrice;
import com.capstone.device.domain.repository.WaterPriceRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of WaterPriceService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterPriceServiceImpl implements WaterPriceService {
    WaterPriceRepository waterPriceRepository;

    @Override
    @Transactional
    public WaterPriceResponse createWaterPrice(WaterPriceRequest request) {
        log.info("Creating water price for target: {}", request.usageTarget());

        var wp = WaterPrice.create(builder -> builder
                .usageTarget(request.usageTarget())
                .tax(request.tax())
                .environmentPrice(request.environmentPrice())
                .applicationPeriod(request.applicationPeriod())
                .description(request.description())
                .expirationDate(request.expirationDate()));

        WaterPrice saved = waterPriceRepository.save(wp);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public WaterPriceResponse updateWaterPrice(String id, WaterPriceRequest request) {
        log.info("Updating water price ID: {}", id);
        var wp = waterPriceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Water price not found: " + id));

        wp.setUsageTarget(request.usageTarget());
        wp.setTax(request.tax());
        wp.setEnvironmentPrice(request.environmentPrice());
        wp.setApplicationPeriod(request.applicationPeriod());
        wp.setExpirationDate(request.expirationDate());
        wp.setDescription(request.description());

        WaterPrice updated = waterPriceRepository.save(wp);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteWaterPrice(String id) {
        log.info("Deleting water price ID: {}", id);
        if (!waterPriceRepository.existsById(id)) {
            throw new IllegalArgumentException("Water price not found: " + id);
        }
        waterPriceRepository.deleteById(id);
    }

    @Override
    public WaterPriceResponse getWaterPriceById(String id) {
        log.info("Fetching water price ID: {}", id);
        return waterPriceRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Water price not found: " + id));
    }

    @Override
    public Page<WaterPriceResponse> getAllWaterPrices(Pageable pageable) {
        log.debug("Fetching all water prices with pagination: {}", pageable);
        return waterPriceRepository.findAll(pageable).map(this::mapToResponse);
    }

    private WaterPriceResponse mapToResponse(WaterPrice wp) {
        return new WaterPriceResponse(
                wp.getPriceId(),
                wp.getUsageTarget() != null ? wp.getUsageTarget().name() : null,
                wp.getTax(),
                wp.getEnvironmentPrice(),
                wp.getApplicationPeriod(),
                wp.getExpirationDate(),
                wp.getDescription(),
                wp.getCreatedAt(),
                wp.getUpdatedAt());
    }
}
