package com.capstone.construction.adapter.catalog;

import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.WrapperApiResponse;
import com.capstone.construction.application.usecase.catalog.WaterSupplyNetworkUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/networks")
@RequiredArgsConstructor
@Tag(name = "Water Supply Network Management", description = "APIs for managing water supply network records (mạng lưới cấp nước)")
public class WaterSupplyNetworkController {
    private final WaterSupplyNetworkUseCase networkUseCase;

    @PostMapping
    @Operation(summary = "Create a new water supply network", description = "Initializes a new water supply network record. Network name must be unique.", responses = {
            @ApiResponse(responseCode = "201", description = "Network created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "409", description = "Network with this name already exists")
    })
    public ResponseEntity<WrapperApiResponse> createNetwork(@RequestBody @Valid WaterSupplyNetworkRequest request) {
        log.info("REST request to create network: {}", request.name());
        var response = networkUseCase.createNetwork(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Network created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing water supply network", description = "Updates the attributes of an existing water supply network entry.", responses = {
            @ApiResponse(responseCode = "200", description = "Network updated successfully"),
            @ApiResponse(responseCode = "404", description = "Network not found"),
            @ApiResponse(responseCode = "409", description = "New network name already exists")
    })
    public ResponseEntity<WrapperApiResponse> updateNetwork(
            @PathVariable @Parameter(description = "ID of the network to update", required = true) String id,
            @RequestBody @Valid WaterSupplyNetworkRequest request) {
        log.info("REST request to update network: {}", id);
        var response = networkUseCase.updateNetwork(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Network updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a water supply network", description = "Removes a water supply network record from the system.", responses = {
            @ApiResponse(responseCode = "200", description = "Network deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Network not found")
    })
    public ResponseEntity<WrapperApiResponse> deleteNetwork(
            @PathVariable @Parameter(description = "ID of the network to delete", required = true) String id) {
        log.info("REST request to delete network: {}", id);
        networkUseCase.deleteNetwork(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Network deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get water supply network by ID", description = "Retrieves information for a specific water supply network by its branchId.", responses = {
            @ApiResponse(responseCode = "200", description = "Network found"),
            @ApiResponse(responseCode = "404", description = "Network not found")
    })
    public ResponseEntity<WrapperApiResponse> getNetworkById(
            @PathVariable @Parameter(description = "ID of the network to retrieve", required = true) String id) {
        log.info("REST request to get network: {}", id);
        var response = networkUseCase.getNetworkById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Network retrieved successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all water supply networks", description = "Returns a paginated list of all water supply networks in the system.", responses = {
            @ApiResponse(responseCode = "200", description = "List of networks retrieved successfully")
    })
    public ResponseEntity<WrapperApiResponse> getAllNetworks(
            @PageableDefault(size = 10) @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("REST request to get all networks");
        var response = networkUseCase.getAllNetworks(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Networks retrieved successfully", response, LocalDateTime.now()));
    }
}
