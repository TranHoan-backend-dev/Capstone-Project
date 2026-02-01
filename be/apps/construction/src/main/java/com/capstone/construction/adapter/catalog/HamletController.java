package com.capstone.construction.adapter.catalog;

import com.capstone.construction.application.dto.request.catalog.HamletRequest;
import com.capstone.construction.application.dto.response.WrapperApiResponse;
import com.capstone.construction.application.usecase.catalog.HamletUseCase;
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
@RequestMapping("/hamlets")
@RequiredArgsConstructor
@Tag(name = "Hamlet Management", description = "APIs for managing administrative hamlets/villages")
public class HamletController {
    private final HamletUseCase hamletUseCase;

    @PostMapping
    @Operation(summary = "Create a new hamlet", description = "Adds a new hamlet to a specific commune. Hamlet name must be unique within the catalog.", responses = {
            @ApiResponse(responseCode = "201", description = "Hamlet created successfully", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or commune ID"),
            @ApiResponse(responseCode = "409", description = "Hamlet with this name already exists")
    })
    public ResponseEntity<WrapperApiResponse> createHamlet(@RequestBody @Valid HamletRequest request) {
        log.info("REST request to create hamlet: {}", request.name());
        var response = hamletUseCase.createHamlet(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new WrapperApiResponse(
                HttpStatus.CREATED.value(), "Hamlet created successfully", response, LocalDateTime.now()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing hamlet", description = "Updates the details (name, type, commune) of an existing hamlet entry.", responses = {
            @ApiResponse(responseCode = "200", description = "Hamlet updated successfully"),
            @ApiResponse(responseCode = "404", description = "Hamlet or targeted commune not found"),
            @ApiResponse(responseCode = "409", description = "New hamlet name already exists")
    })
    public ResponseEntity<WrapperApiResponse> updateHamlet(
            @PathVariable @Parameter(description = "ID of the hamlet to update", required = true) String id,
            @RequestBody @Valid HamletRequest request) {
        log.info("REST request to update hamlet: {}", id);
        var response = hamletUseCase.updateHamlet(id, request);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Hamlet updated successfully", response, LocalDateTime.now()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a hamlet", description = "Removes a hamlet from the system.", responses = {
            @ApiResponse(responseCode = "200", description = "Hamlet deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Hamlet not found")
    })
    public ResponseEntity<WrapperApiResponse> deleteHamlet(
            @PathVariable @Parameter(description = "ID of the hamlet to delete", required = true) String id) {
        log.info("REST request to delete hamlet: {}", id);
        hamletUseCase.deleteHamlet(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Hamlet deleted successfully", null, LocalDateTime.now()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get hamlet by ID", description = "Retrieves information for a single hamlet, including associated commune details.", responses = {
            @ApiResponse(responseCode = "200", description = "Hamlet found"),
            @ApiResponse(responseCode = "404", description = "Hamlet not found")
    })
    public ResponseEntity<WrapperApiResponse> getHamletById(
            @PathVariable @Parameter(description = "ID of the hamlet to retrieve", required = true) String id) {
        log.info("REST request to get hamlet: {}", id);
        var response = hamletUseCase.getHamletById(id);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Hamlet retrieved successfully", response, LocalDateTime.now()));
    }

    @GetMapping
    @Operation(summary = "Get all hamlets", description = "Returns a paginated list of all hamlets recorded in the system.", responses = {
            @ApiResponse(responseCode = "200", description = "List of hamlets retrieved successfully")
    })
    public ResponseEntity<WrapperApiResponse> getAllHamlets(
            @PageableDefault(size = 10) @Parameter(description = "Pagination parameters (page, size, sort)") Pageable pageable) {
        log.info("REST request to get all hamlets");
        var response = hamletUseCase.getAllHamlets(pageable);
        return ResponseEntity.ok(new WrapperApiResponse(
                HttpStatus.OK.value(), "Hamlets retrieved successfully", response, LocalDateTime.now()));
    }
}
