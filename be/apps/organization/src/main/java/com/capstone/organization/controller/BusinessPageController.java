package com.capstone.organization.controller;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.Utils;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.organization.dto.request.FilterBusinessPagesRequest;
import com.capstone.organization.dto.request.UpdateBusinessPageRequest;
import com.capstone.organization.dto.response.BusinessPageResponse;
import com.capstone.organization.dto.response.PagedBusinessPageResponse;
import com.capstone.organization.service.boundary.BusinessPageService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Arrays;

@AppLog
@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/business-pages")
@PreAuthorize("hasAuthority('IT_STAFF')")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Business Page", description = "Các endpoint để quản lý trang nghiệp vụ. Tất cả người dùng phải có vai trò IT_STAFF để truy cập các endpoint này")
public class BusinessPageController {
  BusinessPageService businessPageService;
  @NonFinal
  Logger log;

  @PutMapping("/{pageId}")
  @Operation(summary = "Cập nhật trang nghiệp vụ", description = "Cập nhật một trang nghiệp vụ hiện có bằng ID của nó.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin chi tiết cho trang nghiệp vụ, người cập nhật", required = true, content = @Content(schema = @Schema(implementation = UpdateBusinessPageRequest.class)))
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Đã cập nhật trang nghiệp vụ", content = @Content(schema = @Schema(implementation = BusinessPageResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy trang nghiệp vụ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> updateBusinessPage(
    @Parameter(in = ParameterIn.PATH, description = "ID trang nghiệp vụ", required = true, schema = @Schema(type = "string"))
    @PathVariable @NotBlank String pageId,
    @RequestBody @Valid UpdateBusinessPageRequest request) {
    log.info("Update business page request comes to endpoint: {}", pageId);

    var response = businessPageService.updateBusinessPage(pageId, request);

    return Utils.returnOkResponse(
      "Update business page successfully",
      response);
  }

  @GetMapping
  @Operation(summary = "Liệt kê và Lọc các trang nghiệp vụ", description = "Lấy danh sách phân trang các trang nghiệp vụ với tùy chọn lọc theo tên và trạng thái kích hoạt. Kết quả được bao bọc trong một phản hồi API tiêu chuẩn.")
  @ApiResponses({
    @ApiResponse(responseCode = "200", description = "Lấy danh sách trang nghiệp vụ thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = PagedBusinessPageResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu hoặc tham số phân trang không hợp lệ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Truy cập trái phép", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Bị cấm - Yêu cầu vai trò IT_STAFF", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ xảy ra trong khi xử lý yêu cầu", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getBusinessPages(
    @Parameter(description = "Tham số phân trang (page, size, sort)") Pageable pageable,
    @Parameter(description = "Tiêu chí lọc (lọc theo tên và trạng thái hoạt động)") FilterBusinessPagesRequest request) {
    log.info("Get business pages request comes to endpoint: page={}, size={}", pageable.getPageNumber(),
      pageable.getPageSize());

    var status = (request.filter() != null && !request.filter().isBlank()) || request.isActive() != null;
    var response = status ? businessPageService.filterBusinessPagesList(request, pageable)
      : businessPageService.getBusinessPages(pageable);

    return Utils.returnOkResponse(
      "Get business pages successfully",
      response);
  }

  @GetMapping("/e")
  @Operation(summary = "Tra cứu tên trang nghiệp vụ theo ID", description = """
    Truy xuất danh sách tên trang nghiệp vụ tương ứng với danh sách ID trang được cung cấp (phân cách bằng dấu phẩy).

    Dữ liệu phản hồi bao gồm một danh sách chuỗi.

    Endpoint này được sử dụng để giải quyết các định danh trang thành tên dễ đọc, thường là để hiển thị các trang mà nhân viên được ủy quyền truy cập.
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đã truy xuất thành công danh sách tên trang"),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<?> queryAllPagesById(
    @Parameter(description = "Danh sách ID trang nghiệp vụ phân cách bằng dấu phẩy cần tra cứu. Không chứa khoảng trắng, không có dấu phẩy ở cuối", required = true)
    @RequestParam("id")
    String idsList
  ) {
    log.info("REST request to query all pages by ids: {}", idsList);
    var content = Arrays
      .stream(idsList.split(", "))
      .map(String::trim).filter(c -> !c.isBlank())
      .toList();

    return Utils.returnOkResponse(
      "Get all pages by list of ids successfully",
      businessPageService.getAllBusinessPageNamesByIds(content));
  }
}
