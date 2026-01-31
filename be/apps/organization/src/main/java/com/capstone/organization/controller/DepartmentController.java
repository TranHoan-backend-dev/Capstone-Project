package com.capstone.organization.controller;

import com.capstone.organization.dto.request.CreateDepartmentRequest;
import com.capstone.organization.dto.request.UpdateDepartmentRequest;
import com.capstone.organization.dto.response.WrapperApiResponse;
import com.capstone.organization.service.boundary.DepartmentService;
import com.capstone.organization.utils.IdEncoder;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.time.LocalDateTime;

@Slf4j
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/departments")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DepartmentController {
  DepartmentService departmentService;

  @PostMapping
  @Operation(summary = "Create a department", description = "Create a new department and return its data.")
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Department created"),
    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> createDepartment(
    @RequestBody @Valid CreateDepartmentRequest request
  ) {
    log.info("Create department request comes to endpoint: {}", request);
    var response = departmentService.createDepartment(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
      HttpStatus.CREATED.value(),
      "Create department successfully",
      response,
      LocalDateTime.now()
    ));
  }

  @PutMapping("/{departmentId}")
  @Operation(summary = "Update a department", description = "Update department by encoded ID.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Department updated"),
    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    @ApiResponse(responseCode = "404", description = "Department not found", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> updateDepartment(
    @Parameter(
      in = ParameterIn.PATH,
      description = "Encoded department ID",
      required = true,
      schema = @Schema(type = "string")
    )
    @PathVariable @NotBlank String departmentId,
    @RequestBody @Valid UpdateDepartmentRequest request
  ) {
    log.info("Update department request comes to endpoint: {}", departmentId);
    var response = departmentService.updateDepartment(decodeId(departmentId, "departmentId"), request);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Update department successfully",
      response,
      LocalDateTime.now()
    ));
  }

  @GetMapping
  @Operation(summary = "List departments", description = "Get a paged list of departments.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Departments fetched"),
    @ApiResponse(responseCode = "400", description = "Invalid paging parameters", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> getDepartments(
    @Parameter(
      in = ParameterIn.QUERY,
      description = "Page index (0-based)",
      schema = @Schema(type = "integer", defaultValue = "0", minimum = "0")
    )
    @RequestParam(defaultValue = "0") @PositiveOrZero int page,
    @Parameter(
      in = ParameterIn.QUERY,
      description = "Page size",
      schema = @Schema(type = "integer", defaultValue = "20", minimum = "1")
    )
    @RequestParam(defaultValue = "20") @Positive int size
  ) {
    var response = departmentService.getDepartments(page, size);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Get departments successfully",
      response,
      LocalDateTime.now()
    ));
  }

  private @NonNull String decodeId(String encodedId, String fieldName) {
    var decoded = IdEncoder.decode(encodedId);
    if (decoded == null || decoded.isBlank()) {
      throw new IllegalArgumentException(fieldName + " is invalid");
    }
    return decoded;
  }
}
