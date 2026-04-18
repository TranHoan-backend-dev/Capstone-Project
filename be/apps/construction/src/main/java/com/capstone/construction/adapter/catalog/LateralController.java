package com.capstone.construction.adapter.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.usecase.catalog.LateralUseCase;
import com.capstone.construction.application.dto.response.catalog.LateralResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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
@RequiredArgsConstructor
@RequestMapping("/laterals")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "Quản lý Nhánh tổng", description = "Các API quản lý Nhánh tổng cấp nước (Lateral)")
public class LateralController {
  final LateralUseCase lateralUseCase;
  Logger log;

  @PostMapping
  @Operation(summary = "Tạo mới Nhánh tổng", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request chứa thông tin tạo mới nhánh tổng (tên, thông số, ...).
    2. Hệ thống validate DTO đầu vào.
    3. Hệ thống kiểm tra quyền truy cập (Yêu cầu quyền 'IT_STAFF').
    4. Gọi UseCase để xử lý logic lưu trữ dữ liệu.
    5. Trả về response thành công hoặc lỗi tương ứng.

    **Yêu cầu bảo mật:**
    - Bearer Token hợp lệ.
    - User có quyền `IT_STAFF`.""", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo mới nhánh tổng thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ (Validation error)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Chưa xác thực (Unauthorized)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Truy cập bị từ chối (Forbidden) - Sai quyền", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi nội bộ hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createLateral(@RequestBody @Valid LateralRequest request) {
    log.info("REST request to create lateral: {}", request.name());
    var response = lateralUseCase.createLateral(request);
    log.info("Created lateral: {}", response);
    return Utils.returnCreatedResponse("Tạo nhánh tổng thành công");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật Nhánh tổng", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request cập nhật với ID cụ thể.
    2. Validate ID và thông tin body (LateralRequest).
    3. Kiểm tra quyền 'IT_STAFF'.
    4. Gọi UseCase để thực hiện cập nhật.
    5. Trả về kết quả sau khi cập nhật

    Sau khi cập nhật thành công, RabbitMQ sẽ bắn sự kiện cho WebSocket xử lý. WebSocket sẽ gửi thông báo đến tất cả
    các client đang lắng nghe tại /topic/notification. WebSocket kết nối tại /ws
    """, parameters = {
    @Parameter(name = "id", description = "ID của nhánh tổng cần cập nhật", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = LateralResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy nhánh tổng", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateLateral(
    @PathVariable @Parameter(description = "ID của nhánh tổng cần cập nhật") String id,
    @RequestBody @Valid LateralRequest request) {
    log.info("REST request to update lateral: {}", id);
    var response = lateralUseCase.updateLateral(id, request);
    return Utils.returnOkResponse("Cập nhật nhánh tổng thành công", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Xóa Nhánh tổng", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request xóa với ID.
    2. Kiểm tra quyền truy cập.
    3. Gọi UseCase xóa bản ghi

    Sau khi cập nhật thành công, RabbitMQ sẽ bắn sự kiện cho WebSocket xử lý. WebSocket sẽ gửi thông báo đến tất cả
    các client đang lắng nghe tại /topic/notification. WebSocket kết nối tại /ws
    """, parameters = {
    @Parameter(name = "id", description = "ID của nhánh tổng cần xóa", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Xóa thành công", content = @Content(schema = @Schema(implementation = LateralResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy nhánh tổng", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteLateral(
    @PathVariable @Parameter(description = "ID của nhánh tổng cần xóa") String id) {
    log.info("REST request to delete lateral: {}", id);
    lateralUseCase.deleteLateral(id);
    return Utils.returnOkResponse("Xóa nhánh tổng thành công", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy chi tiết Nhánh tổng", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request lấy thông tin chi tiết với ID.
    2. Hệ thống tìm kiếm bản ghi trong database.
    3. Trả về thông tin chi tiết nếu tìm thấy""", parameters = {
    @Parameter(name = "id", description = "ID của nhánh tổng cần lấy thông tin", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công", content = @Content(schema = @Schema(implementation = LateralResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy nhánh tổng", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getLateralById(
    @PathVariable @Parameter(description = "ID của nhánh tổng cần lấy thông tin") String id) {
    log.info("REST request to get lateral: {}", id);
    var response = lateralUseCase.getLateralById(id);
    return Utils.returnOkResponse("Lấy thông tin nhánh tổng thành công", response);
  }

  @GetMapping
  @Operation(summary = "Lấy danh sách Nhánh tổng", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request lấy danh sách nhánh tổng.
    2. Hỗ trợ phân trang qua tham số page, size, sort.
    3. Hỗ trợ tìm kiếm theo từ khóa và lọc theo mạng cấp nước, trạng thái gán mạng.
    4. Trả về danh sách kết quả phân trang.""", parameters = {
    @Parameter(name = "page", description = "Số trang (bắt đầu từ 0)", example = "0"),
    @Parameter(name = "size", description = "Số lượng phần tử trên 1 trang", example = "10"),
    @Parameter(name = "sort", description = "Sắp xếp (VD: name,asc)", example = "name,asc"),
    @Parameter(name = "keyword", description = "Từ khóa tìm kiếm theo tên nhánh tổng hoặc tên mạng cấp nước", example = "A300"),
    @Parameter(name = "networkId", description = "Lọc theo ID mạng cấp nước", example = "550e8400-e29b-41d4-a716-446655440001"),
    @Parameter(name = "networkAssigned", description = "Lọc theo trạng thái gán mạng cấp nước: true = đã gán, false = chưa gán", example = "true")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = LateralResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'BUSINESS_DEPARTMENT_HEAD')")
  public ResponseEntity<WrapperApiResponse> getAllLaterals(
    @PageableDefault @Parameter(hidden = true) Pageable pageable,
    @RequestParam(required = false) String keyword,
    @RequestParam(required = false) String networkId,
    @RequestParam(required = false) Boolean networkAssigned
  ) {
    log.info("REST request to get all laterals with pagination: {}, keyword: {}, networkId: {}, networkAssigned: {}",
      pageable, keyword, networkId, networkAssigned);
    var response = lateralUseCase.getAllLaterals(pageable, keyword, networkId, networkAssigned);
    return Utils.returnOkResponse("Lấy danh sách nhánh tổng thành công", response);
  }
}
