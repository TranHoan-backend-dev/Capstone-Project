package com.capstone.device.adapter;

import com.capstone.device.application.business.boundary.MaterialService;
import com.capstone.device.application.dto.request.MaterialRequest;
import com.capstone.device.application.dto.response.MaterialResponse;
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
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

/**
 * Controller for managing Material / Labor records.
 */
@Slf4j
@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Material Management", description = "Endpoints for managing materials and labor codes")
public class MaterialController {
    MaterialService materialService;

    /**
     * Create a new material record.
     * 
     * @param request the material details
     * @return the created material
     */
    @Operation(summary = "Create a new material", description = "Adds a new material or labor record to the system", responses = {
            @ApiResponse(responseCode = "201", description = "Material created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<WrapperApiResponse> createMaterial(@RequestBody @Valid MaterialRequest request) {
        log.info("REST request to create material: {}", request.jobContent());
        var response = materialService.createMaterial(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Material created successfully", response, LocalDateTime.now()));
    }

    /**
     * Update an existing material record.
     * 
     * @param id      the material ID (labor code)
     * @param request the updated details
     * @return the updated material
     */
    @Operation(summary = "Update a material", description = "Updates details of an existing material record", responses = {
            @ApiResponse(responseCode = "200", description = "Material updated successfully"),
            @ApiResponse(responseCode = "404", description = "Material not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<WrapperApiResponse> updateMaterial(
            @PathVariable @Parameter(description = "Material ID (Labor Code)") String id,
            @RequestBody @Valid MaterialRequest request) {
        log.info("REST request to update material: {}", id);
        var response = materialService.updateMaterial(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Material updated successfully", response, LocalDateTime.now()));
    }

    /**
     * Delete a material record.
     * 
     * @param id the material ID
     * @return success message
     */
    @Operation(summary = "Delete a material", description = "Removes a material record from the system", responses = {
            @ApiResponse(responseCode = "200", description = "Material deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Material not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<WrapperApiResponse> deleteMaterial(
            @PathVariable @Parameter(description = "Material ID") String id) {
        log.info("REST request to delete material: {}", id);
        materialService.deleteMaterial(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Material deleted successfully", null, LocalDateTime.now()));
    }

    /**
     * Get a material by ID.
     * 
     * @param id the material ID
     * @return the material details
     */
    @Operation(summary = "Get material by ID", description = "Fetches detailed information of a material record", responses = {
            @ApiResponse(responseCode = "200", description = "Material found"),
            @ApiResponse(responseCode = "404", description = "Material not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<WrapperApiResponse> getMaterialById(
            @PathVariable @Parameter(description = "Material ID") String id) {
        log.info("REST request to get material: {}", id);
        var response = materialService.getMaterialById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Material retrieved successfully", response, LocalDateTime.now()));
    }

    /**
     * Get all materials with pagination.
     * 
     * @param pageable pagination info
     * @return a page of materials
     */
    @Operation(summary = "Get all materials", description = "Retrieves a paginated list of all material records")
    @GetMapping
    public ResponseEntity<WrapperApiResponse> getAllMaterials(@PageableDefault(size = 10) Pageable pageable) {
        log.info("REST request to get all materials with pagination: {}", pageable);
        var response = materialService.getAllMaterials(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Materials retrieved successfully", response, LocalDateTime.now()));
    }
}
