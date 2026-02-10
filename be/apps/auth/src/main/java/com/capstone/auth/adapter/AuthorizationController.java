package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.FilterUsersRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.application.usecase.UsersUseCase;
import com.capstone.auth.infrastructure.utils.Utils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/authorization")
@RequiredArgsConstructor
@Tag(name = "Authorization", description = "Endpoints for managing employee authorization and retrieval")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthorizationController {
  UsersUseCase usersUseCase;

  @Operation(summary = "Get all employees", description = "Retrieves a paginated list of employees. Can optionally filter by 'isEnabled' status and 'username'. "
      +
      "The response is wrapped in a standard API response structure containing the paginated data. " +
      "Requires the 'IT_STAFF' role.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of employees", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeResponse.class))),
      @ApiResponse(responseCode = "401", description = "Unauthorized - User is not authenticated", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "403", description = "Forbidden - User does not have the required 'IT_STAFF' role", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
      @ApiResponse(responseCode = "500", description = "Internal Server Error - An unexpected error occurred", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/employees")
  @PreAuthorize("hasRole('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> getAllEmployees(
      @ParameterObject Pageable pageable,

      @Parameter(description = "Filter criteria for users (isEnabled, username)")
      @RequestParam(required = false)
      FilterUsersRequest request) {
    log.info("Getting all employees with page index {} and page size {}", pageable.getPageNumber(),
        pageable.getPageSize());

    return Utils.returnResponse(
        HttpStatus.OK.value(),
        "Get all employees successfully",
        usersUseCase.getPaginatedListOfEmployees(pageable, request));
  }
}
