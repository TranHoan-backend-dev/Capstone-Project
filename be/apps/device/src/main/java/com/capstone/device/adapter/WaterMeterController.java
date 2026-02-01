package com.capstone.device.adapter;

import com.capstone.device.application.business.boundary.WaterMeterService;
import com.capstone.device.application.dto.request.WaterMeterRequest;
import com.capstone.device.application.dto.response.WaterMeterResponse;
import com.capstone.device.application.dto.response.WrapperApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * Controller for managing Water Meter records.
 */
@Slf4j
@RestController
@RequestMapping("/water-meters")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Water Meter Management", description = "Endpoints for managing water meters and their technical details")
public class WaterMeterController {
        WaterMeterService waterMeterService;

        /**
         * Create a new water meter record.
         * 
         * @param request the water meter details
         * @return the created water meter
         */
        @Operation(summary = "Create a new water meter", description = "Adds a new water meter record to the system", responses = {
                        @ApiResponse(responseCode = "201", description = "Water meter created successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data")
        })
        @PostMapping
        public ResponseEntity<WrapperApiResponse> createWaterMeter(@RequestBody @Valid WaterMeterRequest request) {
                log.info("REST request to create water meter: {}", request.size());
                var response = waterMeterService.createWaterMeter(request);
                return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                                HttpStatus.CREATED.value(), "Water meter created successfully", response,
                                LocalDateTime.now()));
        }

        /**
         * Update an existing water meter record.
         * 
         * @param id      the water meter ID
         * @param request the updated details
         * @return the updated water meter
         */
        @Operation(summary = "Update a water meter", description = "Updates details of an existing water meter record", responses = {
                        @ApiResponse(responseCode = "200", description = "Water meter updated successfully"),
                        @ApiResponse(responseCode = "404", description = "Water meter not found")
        })
        @PutMapping("/{id}")
        public ResponseEntity<WrapperApiResponse> updateWaterMeter(
                        @PathVariable @Parameter(description = "Water Meter ID") String id,
                        @RequestBody @Valid WaterMeterRequest request) {
                log.info("REST request to update water meter: {}", id);
                var response = waterMeterService.updateWaterMeter(id, request);
                return ResponseEntity.ok(new WrapperApiResponse(
                                HttpStatus.OK.value(), "Water meter updated successfully", response,
                                LocalDateTime.now()));
        }

        /**
         * Delete a water meter record.
         * 
         * @param id the water meter ID
         * @return success message
         */
        @Operation(summary = "Delete a water meter", description = "Removes a water meter record from the system", responses = {
                        @ApiResponse(responseCode = "200", description = "Water meter deleted successfully"),
                        @ApiResponse(responseCode = "404", description = "Water meter not found")
        })
        @DeleteMapping("/{id}")
        public ResponseEntity<WrapperApiResponse> deleteWaterMeter(
                        @PathVariable @Parameter(description = "Water Meter ID") String id) {
                log.info("REST request to delete water meter: {}", id);
                waterMeterService.deleteWaterMeter(id);
                return ResponseEntity.ok(new WrapperApiResponse(
                                HttpStatus.OK.value(), "Water meter deleted successfully", null, LocalDateTime.now()));
        }

        /**
         * Get a water meter by ID.
         * 
         * @param id the water meter ID
         * @return the water meter details
         */
        @Operation(summary = "Get water meter by ID", description = "Fetches detailed information of a water meter record", responses = {
                        @ApiResponse(responseCode = "200", description = "Water meter found"),
                        @ApiResponse(responseCode = "404", description = "Water meter not found")
        })
        @GetMapping("/{id}")
        public ResponseEntity<WrapperApiResponse> getWaterMeterById(
                        @PathVariable @Parameter(description = "Water Meter ID") String id) {
                log.info("REST request to get water meter: {}", id);
                var response = waterMeterService.getWaterMeterById(id);
                return ResponseEntity.ok(new WrapperApiResponse(
                                HttpStatus.OK.value(), "Water meter retrieved successfully", response,
                                LocalDateTime.now()));
        }

        /**
         * Get all water meters with pagination.
         * 
         * @param pageable pagination info
         * @return a page of water meters
         */
        @Operation(summary = "Get all water meters", description = "Retrieves a paginated list of all water meter records")
        @GetMapping
        public ResponseEntity<WrapperApiResponse> getAllWaterMeters(@PageableDefault(size = 10) Pageable pageable) {
                log.info("REST request to get all water meters with pagination: {}", pageable);
                var response = waterMeterService.getAllWaterMeters(pageable);
                return ResponseEntity.ok(new WrapperApiResponse(
                                HttpStatus.OK.value(), "Water meters retrieved successfully", response,
                                LocalDateTime.now()));
        }
}
