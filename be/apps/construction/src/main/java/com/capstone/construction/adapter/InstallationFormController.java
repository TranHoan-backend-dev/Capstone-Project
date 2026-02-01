package com.capstone.construction.adapter;

import com.capstone.construction.application.dto.request.NewOrderRequest;
import com.capstone.construction.application.dto.response.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.InstallationFormResponse;
import com.capstone.construction.application.dto.response.WrapperApiResponse;
import com.capstone.construction.application.usecase.InstallationFormHandlingUseCase;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/installation-forms")
@RequiredArgsConstructor
@Tag(name = "Installation Form", description = "Endpoints for managing installation forms")
public class InstallationFormController {
    private final InstallationFormHandlingUseCase installationFormHandlingUseCase;

    @Operation(summary = "Create a new installation form", description = "Initializes a new installation request and triggers notification event", responses = {
            @ApiResponse(responseCode = "201", description = "Form created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "409", description = "Form already exists"),
            @ApiResponse(responseCode = "400", description = "Invalid input data")
    })
    @PostMapping
    public ResponseEntity<WrapperApiResponse> createInstallationForm(@RequestBody @Valid NewOrderRequest request) {
        log.info("Received request to create installation form: {}", request.formNumber());

        InstallationFormResponse response = installationFormHandlingUseCase.createNewInstallationRequest(request);

        log.info("Successfully created installation form: {}", response.formNumber());

        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(),
                "Installation form created successfully",
                response,
                LocalDateTime.now()));
    }

    @Operation(summary = "Get grouped paginated installation forms", description = "Retrieves two lists: forms assigned (handoverBy is present) and unassigned", responses = {
            @ApiResponse(responseCode = "200", description = "Records retrieved successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
    })
    @GetMapping
    public ResponseEntity<WrapperApiResponse> getInstallationForms(
            @PageableDefault(size = 10) Pageable pageable) {
        log.info("Received request to fetch grouped installation forms");

        InstallationFormListResponse response = installationFormHandlingUseCase.getPaginatedInstallationForms(pageable);

        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(),
                "Installation forms retrieved successfully",
                response,
                LocalDateTime.now()));
    }
}
