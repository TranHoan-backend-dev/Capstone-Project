package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.IdEncoder;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.boundary.MaterialService;
import com.capstone.device.application.dto.request.MaterialRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "Material Management", description = "Endpoints for managing materials and labor codes")
public class MaterialController {
  final MaterialService materialService;
  Logger log;

  @Operation(summary = "Create a new material", description = "Adds a new material or labor record to the system", responses = {
    @ApiResponse(responseCode = "201", description = "Material created successfully"),
    @ApiResponse(responseCode = "400", description = "Invalid input data")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createMaterial(@RequestBody @Valid MaterialRequest request) {
    log.info("REST request to create material: {}", request.jobContent());
    var response = materialService.createMaterial(request);
    return Utils.returnCreatedResponse("Material created successfully", response);
  }

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
    return Utils.returnOkResponse("Material updated successfully", response);
  }

  @Operation(summary = "Delete a material", description = "Removes a material record from the system", responses = {
    @ApiResponse(responseCode = "200", description = "Material deleted successfully"),
    @ApiResponse(responseCode = "404", description = "Material not found")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteMaterial(
    @PathVariable @Parameter(description = "Material ID") String id) {
    log.info("REST request to delete material: {}", id);
    materialService.deleteMaterial(id);
    return Utils.returnOkResponse("Material deleted successfully", null);
  }

  @Operation(summary = "Get material by ID", description = "Fetches detailed information of a material record", responses = {
    @ApiResponse(responseCode = "200", description = "Material found"),
    @ApiResponse(responseCode = "404", description = "Material not found")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getMaterialById(
    @PathVariable @Parameter(description = "Material ID") String id) {
    log.info("REST request to get material: {}", id);
    var response = materialService.getMaterialById(id);
    return Utils.returnOkResponse("Material retrieved successfully", response);
  }

  @Operation(summary = "Get all materials", description = "Retrieves a paginated list of all material records")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllMaterials(@PageableDefault(size = 10) Pageable pageable) {
    log.info("REST request to get all materials with pagination: {}", pageable);
    var response = materialService.getAllMaterials(pageable);
    return Utils.returnOkResponse("Materials retrieved successfully", response);
  }

  @GetMapping("/exist")
  public ResponseEntity<?> checkExistence(@RequestParam String id) {
    log.info("REST request to check existence of water meter: {}", id);
    if (!Utils.isUUID(id)) {
      id = IdEncoder.decode(id);
    }
    return Utils.returnNoContentResponse("Check material id successfully", materialService.materialExists(id));
  }
}
