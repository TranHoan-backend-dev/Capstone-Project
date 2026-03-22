package com.capstone.device.application.business.waterprice;

import com.capstone.device.application.dto.request.price.CreateRequest;
import com.capstone.device.application.dto.request.price.UpdateRequest;
import com.capstone.device.application.dto.response.water.WaterPriceResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

/**
 * Service interface for managing Water Price operations.
 */
public interface WaterPriceService {
  /**
   * Creates a new water price record.
   *
   * @param request the water price creation request
   * @return the created water price
   */
  WaterPriceResponse createWaterPrice(CreateRequest request);

  /**
   * Updates an existing water price record.
   *
   * @param id      the water price ID
   * @param request the water price update request
   * @return the updated water price response
   */
  WaterPriceResponse updateWaterPrice(String id, UpdateRequest request);

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
   * @param keyword
   * @return a page of water price responses
   */
  Page<WaterPriceResponse> getAllWaterPrices(Pageable pageable, LocalDate keyword);

  Boolean isExisting(String id);
}
