package com.capstone.device.application.business.watermeter;

import com.capstone.device.application.dto.request.WaterMeterRequest;
import com.capstone.device.application.dto.response.water.OverallWaterMeterResponse;
import com.capstone.device.application.dto.response.water.WaterMeterResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing Water Meter operations.
 */
public interface WaterMeterService {
  /**
   * Creates a new water meter record.
   *
   * @param request the water meter creation request
   * @return the created water meter response
   */
  WaterMeterResponse createWaterMeter(WaterMeterRequest request);

  /**
   * Updates an existing water meter record.
   *
   * @param id      the water meter ID
   * @param request the water meter update request
   * @return the updated water meter response
   */
  WaterMeterResponse updateWaterMeter(String id, WaterMeterRequest request);

  /**
   * Deletes a water meter record by ID.
   *
   * @param id the water meter ID
   */
  void deleteWaterMeter(String id);

  /**
   * Retrieves a water meter record by ID.
   *
   * @param id the water meter ID
   * @return the water meter response
   */
  WaterMeterResponse getWaterMeterById(String id);

  /**
   * Retrieves all water meters with pagination.
   *
   * @param pageable pagination information
   * @return a page of water meter responses
   */
  Page<WaterMeterResponse> getAllWaterMeters(Pageable pageable);

  /**
   * Checks if a water meter with the given ID exists.
   *
   * @param id the water meter ID
   * @return true if the water meter exists, false otherwise
   */
  boolean isWaterMeterExisting(String id);

  boolean isOverallWaterMeterExisting(String id);

  void deleteOverallWaterMeterByLateralId(String id);

  Page<OverallWaterMeterResponse> getAllOverallWaterMeters(Pageable pageable, String keyword);
}
