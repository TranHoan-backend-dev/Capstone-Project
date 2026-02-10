package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.FilterUsersRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.application.usecase.UsersUseCase;
import com.capstone.auth.infrastructure.utils.IdEncoder;
import com.capstone.auth.infrastructure.utils.Utils;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
@PreAuthorize("hasRole('IT_STAFF')")
@Tag(name = "Authorization", description = "Endpoints for managing employee authorization and retrieval")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthorizationController {
  UsersUseCase usersUseCase;

  @Operation(summary = "Get all employees", description = "Retrieves a paginated list of employees. Can optionally filter by 'isEnabled' status and 'username'. You can view employee's pages that have access right by calling the endpoint /employees/{id}/pages"
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
  public ResponseEntity<WrapperApiResponse> getAllEmployees(
    @ParameterObject Pageable pageable,

    @Parameter(description = "Filter criteria for users (isEnabled, username)") @RequestParam(required = false) FilterUsersRequest request) {
    log.info("Getting all employees with page index {} and page size {}", pageable.getPageNumber(),
      pageable.getPageSize());

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Get all employees successfully",
      usersUseCase.getPaginatedListOfEmployees(pageable, request));
  }

  @Operation(summary = "Get authorized business pages for an employee", description = "Retrieves a list of business page names that the employee with the specified ID is authorized to access. "
    + "This API is used to fetch the websites/pages the employee has access rights to. "
    + "Query by employee ID (encoded).")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of authorized business pages", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Object.class))),
    @ApiResponse(responseCode = "404", description = "Employee not found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/employees/{empId}/pages")
  public ResponseEntity<WrapperApiResponse> getBusinessPageNamesOfEmployees(
    @Parameter(description = "The encoded ID of the employee", required = true)
    @PathVariable
    String empId
  ) {
    log.info("Getting pages of employee with id {}", empId);
    empId = IdEncoder.decode(empId);

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Get pages successfully",
      usersUseCase.getListOfPagesByEmployeeId(empId));
  }
}
