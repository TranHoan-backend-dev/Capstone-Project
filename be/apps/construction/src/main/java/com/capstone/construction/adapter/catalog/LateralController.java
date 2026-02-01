package com.capstone.construction.adapter.catalog;

import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.dto.response.WrapperApiResponse;
import com.capstone.construction.application.usecase.catalog.LateralUseCase;
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
@RequestMapping("/laterals")
@RequiredArgsConstructor
@Tag(name = "Lateral Management", description = "APIs for managing water supply laterals (tuyến ống)")
public class LateralController {
    private final LateralUseCase lateralUseCase;

    @PostMapping
    @Operation(summary = "Create a new lateral", description = "Adds a new water supply lateral linked to a specific network. Name must be unique.", responses = {
            @ApiResponse(responseCode = "201", description = "Lateral created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or network ID"),
            @ApiResponse(responseCode = "409", description = "Lateral with this name already exists")
    })
    public ResponseEntity<WrapperApiResponse> createLateral(@RequestBody @Valid LateralRequest request) {
        log.info("REST request to create lateral: {}", request.name());
        var response = lateralUseCase.createLateral(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Lateral created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing lateral", description = "Updates the name or associated network of an existing lateral.", responses = {
            @ApiResponse(responseCode = "200", description = "Lateral updated successfully"),
            @ApiResponse(responseCode = "404", description = "Lateral or target network not found"),
            @ApiResponse(responseCode = "409", description = "New lateral name already exists")
    })
    public ResponseEntity<WrapperApiResponse> updateLateral(
            @PathVariable @Parameter(description = "ID of the lateral to update", required = true) String id,
            @RequestBody @Valid LateralRequest request) {
        log.info("REST request to update lateral: {}", id);
        var response = lateralUseCase.updateLateral(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Lateral updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a lateral", description = "Removes a lateral from the system catalog.", responses = {
            @ApiResponse(responseCode = "200", description = "Lateral deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Lateral not found")
    })
    public ResponseEntity<WrapperApiResponse> deleteLateral(
            @PathVariable @Parameter(description = "ID of the lateral to delete", required = true) String id) {
        log.info("REST request to delete lateral: {}", id);
        lateralUseCase.deleteLateral(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Lateral deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get lateral by ID", description = "Retrieves information for a single lateral entry.", responses = {
            @ApiResponse(responseCode = "200", description = "Lateral details found"),
            @ApiResponse(responseCode = "404", description = "Lateral not found")
    })
    public ResponseEntity<WrapperApiResponse> getLateralById(
            @PathVariable @Parameter(description = "ID of the lateral to retrieve", required = true) String id) {
        log.info("REST request to get lateral: {}", id);
        var response = lateralUseCase.getLateralById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Lateral retrieved successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all laterals", description = "Returns a paginated list of all water supply laterals.", responses = {
            @ApiResponse(responseCode = "200", description = "List of laterals retrieved successfully")
    })
    public ResponseEntity<WrapperApiResponse> getAllLaterals(
            @PageableDefault(size = 10) @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("REST request to get all laterals");
        var response = lateralUseCase.getAllLaterals(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Laterals retrieved successfully", response, LocalDateTime.now()));
    }
}
