package com.capstone.device.adapter;

import com.capstone.device.application.business.boundary.WaterPriceService;
import com.capstone.device.application.dto.request.WaterPriceRequest;
import com.capstone.device.application.dto.response.WaterPriceResponse;
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
 * Controller for managing Water Price policies.
 */
@Slf4j
@RestController
@RequestMapping("/water-prices")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Water Price Management", description = "Endpoints for managing water pricing policies and usage targets")
public class WaterPriceController {
        private final WaterPriceService waterPriceService;

        /**
         * Create a new water price policy.
         * 
         * @param request the water price details
         * @return the created water price
         */
        @Operation(summary = "Create a new water price", description = "Adds a new water pricing policy to the system", responses = {
                        @ApiResponse(responseCode = "201", description = "Water price created successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data")
        })
        @PostMapping
        public ResponseEntity<WrapperApiResponse> createWaterPrice(@RequestBody @Valid WaterPriceRequest request) {
                log.info("REST request to create water price for target: {}", request.usageTarget());
                var response = waterPriceService.createWaterPrice(request);
                return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                                HttpStatus.CREATED.value(), "Water price created successfully", response,
                                LocalDateTime.now()));
        }

        /**
         * Update an existing water price policy.
         * 
         * @param id      the water price ID
         * @param request the updated details
         * @return the updated water price
         */
        @Operation(summary = "Update a water price", description = "Updates details of an existing water pricing policy", responses = {
                        @ApiResponse(responseCode = "200", description = "Water price updated successfully"),
                        @ApiResponse(responseCode = "404", description = "Water price not found")
        })
        @PutMapping("/{id}")
        public ResponseEntity<WrapperApiResponse> updateWaterPrice(
                        @PathVariable @Parameter(description = "Water Price ID") String id,
                        @RequestBody @Valid WaterPriceRequest request) {
                log.info("REST request to update water price: {}", id);
                var response = waterPriceService.updateWaterPrice(id, request);
                return ResponseEntity.ok(new WrapperApiResponse(
                                HttpStatus.OK.value(), "Water price updated successfully", response,
                                LocalDateTime.now()));
        }

        /**
         * Delete a water price policy.
         * 
         * @param id the water price ID
         * @return success message
         */
        @Operation(summary = "Delete a water price", description = "Removes a water pricing policy from the system", responses = {
                        @ApiResponse(responseCode = "200", description = "Water price deleted successfully"),
                        @ApiResponse(responseCode = "404", description = "Water price not found")
        })
        @DeleteMapping("/{id}")
        public ResponseEntity<WrapperApiResponse> deleteWaterPrice(
                        @PathVariable @Parameter(description = "Water Price ID") String id) {
                log.info("REST request to delete water price: {}", id);
                waterPriceService.deleteWaterPrice(id);
                return ResponseEntity.ok(new WrapperApiResponse(
                                HttpStatus.OK.value(), "Water price deleted successfully", null, LocalDateTime.now()));
        }

        /**
         * Get a water price by ID.
         * 
         * @param id the water price ID
         * @return the water price details
         */
        @Operation(summary = "Get water price by ID", description = "Fetches detailed information of a water pricing policy", responses = {
                        @ApiResponse(responseCode = "200", description = "Water price found"),
                        @ApiResponse(responseCode = "404", description = "Water price not found")
        })
        @GetMapping("/{id}")
        public ResponseEntity<WrapperApiResponse> getWaterPriceById(
                        @PathVariable @Parameter(description = "Water Price ID") String id) {
                log.info("REST request to get water price: {}", id);
                var response = waterPriceService.getWaterPriceById(id);
                return ResponseEntity.ok(new WrapperApiResponse(
                                HttpStatus.OK.value(), "Water price retrieved successfully", response,
                                LocalDateTime.now()));
        }

        /**
         * Get all water prices with pagination.
         * 
         * @param pageable pagination info
         * @return a page of water prices
         */
        @Operation(summary = "Get all water prices", description = "Retrieves a paginated list of all water pricing policies")
        @GetMapping
        public ResponseEntity<WrapperApiResponse> getAllWaterPrices(@PageableDefault(size = 10) Pageable pageable) {
                log.info("REST request to get all water prices with pagination: {}", pageable);
                var response = waterPriceService.getAllWaterPrices(pageable);
                return ResponseEntity.ok(new WrapperApiResponse(
                                HttpStatus.OK.value(), "Water prices retrieved successfully", response,
                                LocalDateTime.now()));
        }
}
