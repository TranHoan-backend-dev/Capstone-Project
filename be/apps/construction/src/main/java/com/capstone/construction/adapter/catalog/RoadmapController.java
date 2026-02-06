package com.capstone.construction.adapter.catalog;

import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.WrapperApiResponse;
import com.capstone.construction.application.usecase.catalog.RoadmapUseCase;
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
@RequestMapping("/roadmaps")
@RequiredArgsConstructor
@Tag(name = "Roadmap Management", description = "APIs for managing infrastructure roadmaps (lộ trình tuyến ống)")
public class RoadmapController {
    private final RoadmapUseCase roadmapUseCase;

    @PostMapping
    @Operation(summary = "Create a new roadmap", description = "Adds a new roadmap record linking a lateral and a network. Name must be unique.", responses = {
            @ApiResponse(responseCode = "201", description = "Roadmap created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or dependency IDs"),
            @ApiResponse(responseCode = "409", description = "Roadmap with this name already exists")
    })
    public ResponseEntity<WrapperApiResponse> createRoadmap(@RequestBody @Valid RoadmapRequest request) {
        log.info("REST request to create roadmap: {}", request.name());
        var response = roadmapUseCase.createRoadmap(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Roadmap created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing roadmap", description = "Updates the name or associated lateral/network of an existing roadmap.", responses = {
            @ApiResponse(responseCode = "200", description = "Roadmap updated successfully"),
            @ApiResponse(responseCode = "404", description = "Roadmap or target entities not found"),
            @ApiResponse(responseCode = "409", description = "New roadmap name already exists")
    })
    public ResponseEntity<WrapperApiResponse> updateRoadmap(
            @PathVariable @Parameter(description = "ID of the roadmap to update", required = true) String id,
            @RequestBody @Valid RoadmapRequest request) {
        log.info("REST request to update roadmap: {}", id);
        var response = roadmapUseCase.updateRoadmap(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Roadmap updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a roadmap", description = "Removes a roadmap entry from the system.", responses = {
            @ApiResponse(responseCode = "200", description = "Roadmap deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Roadmap not found")
    })
    public ResponseEntity<WrapperApiResponse> deleteRoadmap(
            @PathVariable @Parameter(description = "ID of the roadmap to delete", required = true) String id) {
        log.info("REST request to delete roadmap: {}", id);
        roadmapUseCase.deleteRoadmap(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Roadmap deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get roadmap by ID", description = "Retrieves information for a single roadmap by its unique roadmapId.", responses = {
            @ApiResponse(responseCode = "200", description = "Roadmap found"),
            @ApiResponse(responseCode = "404", description = "Roadmap not found")
    })
    public ResponseEntity<WrapperApiResponse> getRoadmapById(
            @PathVariable @Parameter(description = "ID of the roadmap to retrieve", required = true) String id) {
        log.info("REST request to get roadmap: {}", id);
        var response = roadmapUseCase.getRoadmapById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Roadmap retrieved successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all roadmaps", description = "Returns a paginated list of all roadmaps recorded in the system.", responses = {
            @ApiResponse(responseCode = "200", description = "List of roadmaps retrieved successfully")
    })
    public ResponseEntity<WrapperApiResponse> getAllRoadmaps(
            @PageableDefault(size = 10) @Parameter(description = "Pagination parameters") Pageable pageable) {
        log.info("REST request to get all roadmaps");
        var response = roadmapUseCase.getAllRoadmaps(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Roadmaps retrieved successfully", response, LocalDateTime.now()));
    }
}
