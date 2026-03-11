package com.capstone.customer.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.customer.dto.request.ContractRequest;
import com.capstone.customer.service.boundary.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.springdoc.core.annotations.ParameterObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
@Tag(name = "Quản lý hợp đồng sử dụng nước", description = "API cho các thao tác liên quan đến hợp đồng sử dụng nước của khách hàng")
public class ContractController {
  private Logger log;
  private final ContractService contractService;

  @Operation(summary = "Tạo mới hợp đồng", description = "Tạo một hợp đồng sử dụng nước mới dựa trên thông tin yêu cầu.", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo hợp đồng thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ")
  })
  @PostMapping
  public ResponseEntity<WrapperApiResponse> createContract(@RequestBody @Valid ContractRequest request) {
    log.info("REST request to create contract: {}", request.contractId());
    var response = contractService.createContract(request);
    log.info(response.toString());
    return Utils.returnCreatedResponse("Tạo hợp đồng thành công");
  }

  @Operation(summary = "Cập nhật hợp đồng", description = "Cập nhật thông tin hợp đồng hiện có dựa trên mã hợp đồng.", responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật hợp đồng thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy hợp đồng")
  })
  @PutMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> updateContract(
    @PathVariable @Parameter(description = "Mã hợp đồng cần cập nhật", example = "HD001") String id,
    @RequestBody @Valid ContractRequest request
  ) {
    log.info("REST request to update contract: {}", id);
    var response = contractService.updateContract(id, request);
    return Utils.returnOkResponse("Cập nhật hợp đồng thành công", response);
  }

  @Operation(summary = "Xóa hợp đồng", description = "Xóa một hợp đồng khỏi hệ thống.", responses = {
    @ApiResponse(responseCode = "200", description = "Xóa hợp đồng thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy hợp đồng")
  })
  @DeleteMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> deleteContract(
    @PathVariable @Parameter(description = "Mã hợp đồng cần xóa", example = "HD001") String id
  ) {
    log.info("REST request to delete contract: {}", id);
    contractService.deleteContract(id);
    return Utils.returnOkResponse("Xóa hợp đồng thành công", null);
  }

  @Operation(summary = "Lấy thông tin hợp đồng theo ID", description = "Truy xuất thông tin chi tiết của một hợp đồng cụ thể.", responses = {
    @ApiResponse(responseCode = "200", description = "Lấy thông tin hợp đồng thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy hợp đồng")
  })
  @GetMapping("/{id}")
  public ResponseEntity<WrapperApiResponse> getContractById(
    @PathVariable @Parameter(description = "Mã hợp đồng cần lấy thông tin", example = "HD001") String id
  ) {
    log.info("REST request to get contract: {}", id);
    var response = contractService.getContractById(id);
    return Utils.returnOkResponse("Lấy thông tin hợp đồng thành công", response);
  }

  @Operation(summary = "Lấy danh sách hợp đồng", description = "Truy xuất danh sách hợp đồng với các tiêu chí lọc và phân trang.", responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách hợp đồng thành công")
  })
  @GetMapping
  public ResponseEntity<WrapperApiResponse> getAllContracts(
    @PageableDefault @ParameterObject Pageable pageable,
    @Parameter(description = "Thông tin lọc (từ khóa, ngày bắt đầu, ngày kết thúc)")
    @ParameterObject BaseFilterRequest request
  ) {
    log.info("REST request to get all contracts with pagination: {}", pageable);
    var response = contractService.getAllContracts(pageable, request);
    return Utils.returnOkResponse("Lấy danh sách hợp đồng thành công", response);
  }
}
