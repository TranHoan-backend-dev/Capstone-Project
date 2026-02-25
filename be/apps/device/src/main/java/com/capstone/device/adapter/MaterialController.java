package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.material.MaterialService;
import com.capstone.device.application.dto.request.material.CreateRequest;
import com.capstone.device.application.dto.request.material.UpdateRequest;
import com.capstone.device.application.usecase.MaterialUseCase;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/materials")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "", description = "")
public class MaterialController {
  final MaterialUseCase mUseCase;
  final MaterialService mService;
  Logger log;

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "201", description = ""),
    @ApiResponse(responseCode = "", description = "")
  })
  @PostMapping
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createMaterial(@RequestBody @Valid CreateRequest request) {
    log.info("REST request to create material: {}", request.jobContent());
    var response = mUseCase.create(request);
    log.info("Response: {}", response);
    return Utils.returnCreatedResponse("Material created successfully");
  }

  @Operation(summary = "Update a material", description = "Updates details of an existing material record", responses = {
    @ApiResponse(responseCode = "200", description = "Material updated successfully"),
    @ApiResponse(responseCode = "404", description = "Material not found")
  })
  @PutMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateMaterial(
    @PathVariable @Parameter(description = "") String id,
    @RequestBody @Valid UpdateRequest request
  ) {
    log.info("REST request to update material: {}", id);
    var response = mUseCase.update(id, request);
    return Utils.returnOkResponse("Material updated successfully", response);
  }

  @Operation(summary = "Delete a material", description = "Removes a material record from the system", responses = {
    @ApiResponse(responseCode = "200", description = "Material deleted successfully"),
    @ApiResponse(responseCode = "404", description = "Material not found")
  })
  @DeleteMapping("/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteMaterial(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to delete material: {}", id);
    mUseCase.delete(id);
    return Utils.returnOkResponse("Material deleted successfully", null);
  }

  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = ""),
    @ApiResponse(responseCode = "", description = "")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getMaterialById(
    @PathVariable @Parameter(description = "") String id) {
    log.info("REST request to get material: {}", id);
    var response = mUseCase.get(id);
    return Utils.returnOkResponse("Material retrieved successfully", response);
  }

  @Operation(summary = "", description = "")
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllMaterials(@PageableDefault Pageable pageable) {
    log.info("REST request to get all materials with pagination: {}", pageable);
    var response = mUseCase.getAll(pageable);
    return Utils.returnOkResponse("Materials retrieved successfully", response);
  }

  // internal api, do not expose
  @GetMapping("/exist")
  public ResponseEntity<?> checkExistence(@RequestParam String id) {
    log.info("REST request to check existence of water meter: {}", id);
    return Utils.returnNoContentResponse("Check material id successfully", mService.materialExists(id));
  }
}
