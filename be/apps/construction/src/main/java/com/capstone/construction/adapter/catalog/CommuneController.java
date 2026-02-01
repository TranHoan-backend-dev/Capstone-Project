package com.capstone.construction.adapter.catalog;

import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.WrapperApiResponse;
import com.capstone.construction.application.usecase.catalog.CommuneUseCase;
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
@RequestMapping("/communes")
@RequiredArgsConstructor
@Tag(name = "Commune Management", description = "APIs for managing administrative communes/wards")
public class CommuneController {
    private final CommuneUseCase communeUseCase;

    @PostMapping
    @Operation(summary = "Create a new commune", description = "Adds a new commune to the catalog. The commune name must be unique.", responses = {
            @ApiResponse(responseCode = "201", description = "Commune created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload"),
            @ApiResponse(responseCode = "409", description = "Commune with this name already exists")
    })
    public ResponseEntity<WrapperApiResponse> createCommune(@RequestBody @Valid CommuneRequest request) {
        log.info("REST request to create commune: {}", request.name());
        var response = communeUseCase.createCommune(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Commune created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing commune", description = "Updates the details of a commune identified by its unique ID.", parameters = {
            @Parameter(name = "id", description = "Unique identifier of the commune", required = true, example = "uuid-123")
    }, responses = {
            @ApiResponse(responseCode = "200", description = "Commune updated successfully"),
            @ApiResponse(responseCode = "404", description = "Commune not found"),
            @ApiResponse(responseCode = "409", description = "New commune name already exists")
    })
    public ResponseEntity<WrapperApiResponse> updateCommune(
            @PathVariable @Parameter(description = "ID of the commune to update") String id,
            @RequestBody @Valid CommuneRequest request) {
        log.info("REST request to update commune: {}", id);
        var response = communeUseCase.updateCommune(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Commune updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a commune", description = "Removes a commune from the system. Warning: This may fail if there are existing dependencies.", responses = {
            @ApiResponse(responseCode = "200", description = "Commune deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Commune not found")
    })
    public ResponseEntity<WrapperApiResponse> deleteCommune(
            @PathVariable @Parameter(description = "ID of the commune to delete") String id) {
        log.info("REST request to delete commune: {}", id);
        communeUseCase.deleteCommune(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Commune deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get commune by ID", description = "Retrieves detailed information about a specific commune.", responses = {
            @ApiResponse(responseCode = "200", description = "Commune found"),
            @ApiResponse(responseCode = "404", description = "Commune not found")
    })
    public ResponseEntity<WrapperApiResponse> getCommuneById(
            @PathVariable @Parameter(description = "ID of the commune to retrieve") String id) {
        log.info("REST request to get commune: {}", id);
        var response = communeUseCase.getCommuneById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Commune retrieved successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all communes", description = "Returns a paginated list of all communes in the system.", responses = {
            @ApiResponse(responseCode = "200", description = "List of communes retrieved successfully")
    })
    public ResponseEntity<WrapperApiResponse> getAllCommunes(
            @PageableDefault(size = 10) @Parameter(description = "Pagination parameters (page, size, sort)") Pageable pageable) {
        log.info("REST request to get all communes");
        var response = communeUseCase.getAllCommunes(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Communes retrieved successfully", response, LocalDateTime.now()));
    }
}
