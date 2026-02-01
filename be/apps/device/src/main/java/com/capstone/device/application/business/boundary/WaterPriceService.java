package com.capstone.device.application.business.boundary;

import com.capstone.device.application.dto.request.WaterPriceRequest;
import com.capstone.device.application.dto.response.WaterPriceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing Water Price operations.
 */
public interface WaterPriceService {
    /**
     * Creates a new water price record.
     * 
     * @param request the water price creation request
     * @return the created water price response
     */
    WaterPriceResponse createWaterPrice(WaterPriceRequest request);

    /**
     * Updates an existing water price record.
     * 
     * @param id      the water price ID
     * @param request the water price update request
     * @return the updated water price response
     */
    WaterPriceResponse updateWaterPrice(String id, WaterPriceRequest request);

    /**
     * Deletes a water price record by ID.
     * 
     * @param id the water price ID
     */
    void deleteWaterPrice(String id);

    /**
     * Retrieves a water price record by ID.
     * 
     * @param id the water price ID
     * @return the water price response
     */
    WaterPriceResponse getWaterPriceById(String id);

    /**
     * Retrieves all water prices with pagination.
     * 
     * @param pageable pagination information
     * @return a page of water price responses
     */
    Page<WaterPriceResponse> getAllWaterPrices(Pageable pageable);
}
