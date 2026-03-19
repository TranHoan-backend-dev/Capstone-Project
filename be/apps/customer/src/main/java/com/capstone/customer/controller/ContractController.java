package com.capstone.customer.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.customer.dto.request.ContractFilterRequest;
import com.capstone.customer.dto.response.ContractResponse;
import com.capstone.customer.service.boundary.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.springdoc.core.annotations.ParameterObject;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@AppLog
@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('IT_STAFF', 'ORDER_RECEIVING_STAFF')")
@Tag(name = "Quản lý hợp đồng sử dụng nước", description = "API cho các thao tác liên quan đến hợp đồng sử dụng nước của khách hàng")
public class ContractController {
    private Logger log;
    private final ContractService contractService;

    @Operation(summary = "Tạo mới hợp đồng", description = "Tạo một hợp đồng sử dụng nước mới dựa trên thông tin yêu cầu.", responses = {
        @ApiResponse(responseCode = "201", description = "Tạo hợp đồng thành công"),
        @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
    })
    @PostMapping
    public ResponseEntity<WrapperApiResponse> createContract(@RequestBody @Valid com.capstone.customer.dto.request.contract.CreateRequest request) {
        log.info("REST request to create contract: {}", request.contractId());
        var response = contractService.createContract(request);
        log.info(response.toString());
        return Utils.returnCreatedResponse("Tạo hợp đồng thành công");
    }

    @Operation(summary = "Xóa hợp đồng", description = "Xóa một hợp đồng khỏi hệ thống.", responses = {
        @ApiResponse(responseCode = "200", description = "Xóa hợp đồng thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContractResponse.class))),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy hợp đồng", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
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
        @ApiResponse(responseCode = "200", description = "Lấy thông tin hợp đồng thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContractResponse.class))),
        @ApiResponse(responseCode = "404", description = "Không tìm thấy hợp đồng", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
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
        @ApiResponse(responseCode = "200", description = "Lấy danh sách hợp đồng thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = ContractResponse.class)))
    })
    @GetMapping
    public ResponseEntity<WrapperApiResponse> getAllContracts(
            @PageableDefault @ParameterObject Pageable pageable,
            @Parameter(description = "Thông tin lọc (từ khóa tìm kiếm, mã hợp đồng, mã form, số form, ID khách hàng, tên khách hàng, số điện thoại khách hàng, ngày bắt đầu, ngày kết thúc, đại diện, phụ lục)")
            @ParameterObject ContractFilterRequest request
    ) {
        log.info("REST request to get all contracts with pagination: {}", pageable);
        var response = contractService.getAllContracts(pageable, request);
        return Utils.returnOkResponse("Lấy danh sách hợp đồng thành công", response);
    }
}
