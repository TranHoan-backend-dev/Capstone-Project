package com.capstone.organization.controller;

import com.capstone.organization.dto.request.CreateJobRequest;
import com.capstone.organization.dto.request.UpdateJobRequest;
import com.capstone.organization.dto.response.WrapperApiResponse;
import com.capstone.organization.service.boundary.JobService;
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
@RequestMapping("/jobs")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobController {
  JobService jobService;

  @PostMapping
  @Operation(summary = "Create a job", description = "Create a new job and return its data.")
  @ApiResponses({
    @ApiResponse(responseCode = "201", description = "Job created"),
    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> createJob(
    @RequestBody @Valid CreateJobRequest request
  ) {
    log.info("Create job request comes to endpoint: {}", request);
    var response = jobService.createJob(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
      HttpStatus.CREATED.value(),
      "Create job successfully",
      response,
      LocalDateTime.now()
    ));
  }

  @PutMapping("/{jobId}")
  @Operation(summary = "Update a job", description = "Update job by encoded ID.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Job updated"),
    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
    @ApiResponse(responseCode = "404", description = "Job not found", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> updateJob(
    @Parameter(
      in = ParameterIn.PATH,
      description = "Encoded job ID",
      required = true,
      schema = @Schema(type = "string")
    )
    @PathVariable @NotBlank String jobId,
    @RequestBody @Valid UpdateJobRequest request
  ) {
    log.info("Update job request comes to endpoint: {}", jobId);
    var response = jobService.updateJob(decodeId(jobId, "jobId"), request);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Update job successfully",
      response,
      LocalDateTime.now()
    ));
  }

  @GetMapping
  @Operation(summary = "List jobs", description = "Get a paged list of jobs.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Jobs fetched"),
    @ApiResponse(responseCode = "400", description = "Invalid paging parameters", content = @Content),
    @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
  })
  public ResponseEntity<WrapperApiResponse> getJobs(
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
    var response = jobService.getJobs(page, size);
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Get jobs successfully",
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
