package com.capstone.construction.adapter.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.dto.response.catalog.RoadResponse;
import com.capstone.construction.application.usecase.catalog.RoadUseCase;
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
@RequestMapping("/roads")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Tag(name = "Quản lý Đường phố", description = "Các API quản lý Đường phố (Road)")
public class RoadController {
  final RoadUseCase roadUseCase;
  Logger log;

  @PostMapping
  @Operation(summary = "Tạo mới Đường phố", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request chứa thông tin tạo mới đường phố (tên, mã, ...).
    2. Hệ thống validate DTO đầu vào.
    3. Hệ thống kiểm tra quyền truy cập (Yêu cầu quyền 'IT_STAFF').
    4. Gọi UseCase để xử lý logic lưu trữ dữ liệu.
    5. Trả về response thành công hoặc lỗi tương ứng.

    **Yêu cầu bảo mật:**
    - Bearer Token hợp lệ.
    - User có quyền `IT_STAFF`.""", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo mới đường phố thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ (Validation error)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Chưa xác thực (Unauthorized)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Truy cập bị từ chối (Forbidden) - Sai quyền", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi nội bộ hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createRoad(@RequestBody @Valid RoadRequest request) {
    log.info("REST request to create road: {}", request.name());
    var response = roadUseCase.createRoad(request);
    log.info("Created road: {}", response);
    return Utils.returnCreatedResponse("Road created successfully");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật Đường phố", description = """
        **Luồng nghiệp vụ:**
        1. Client gửi request cập nhật với ID cụ thể.
        2. Validate ID và thông tin body (RoadRequest).
        3. Kiểm tra quyền 'IT_STAFF'.
        4. Gọi UseCase để thực hiện cập nhật.
        5. Trả về kết quả sau khi cập nhật.

    Sau khi cập nhật thành công, RabbitMQ sẽ bắn sự kiện cho WebSocket xử lý. WebSocket sẽ gửi thông báo đến tất cả
    các client đang lắng nghe tại /topic/notification. WebSocket kết nối tại /ws
    """, parameters = {
    @Parameter(name = "id", description = "ID của đường phố cần cập nhật", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = RoadResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đường phố", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateRoad(
    @PathVariable @Parameter(description = "ID của đường phố cần cập nhật", required = true) String id,
    @RequestBody @Valid RoadRequest request) {
    log.info("REST request to update road: {}", id);
    var response = roadUseCase.updateRoad(id, request);
    return Utils.returnOkResponse("Road updated successfully", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Xóa Đường phố", description = """
     **Luồng nghiệp vụ:**
     1. Client gửi request xóa với ID.
     2. Kiểm tra quyền truy cập.
     3. Gọi UseCase xóa bản ghi.

    Sau khi cập nhật thành công, RabbitMQ sẽ bắn sự kiện cho WebSocket xử lý. WebSocket sẽ gửi thông báo đến tất cả
    các client đang lắng nghe tại /topic/notification. WebSocket kết nối tại /ws
    """, parameters = {
    @Parameter(name = "id", description = "ID của đường phố cần xóa", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Xóa thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đường phố", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteRoad(
    @PathVariable @Parameter(description = "ID của đường phố cần xóa", required = true) String id) {
    log.info("REST request to delete road: {}", id);
    roadUseCase.deleteRoad(id);
    return Utils.returnOkResponse("Road deleted successfully", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy thông tin chi tiết về 1 Đường phố", description = """
     **Luồng nghiệp vụ:**
     1. Client gửi request lấy thông tin chi tiết với ID.
     2. Hệ thống tìm kiếm bản ghi trong database.
     3. Trả về thông tin chi tiết nếu tìm thấy.
    """, parameters = {
    @Parameter(name = "id", description = "ID của đường phố cần lấy thông tin", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công", content = @Content(schema = @Schema(implementation = RoadResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy đường phố", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getRoadById(
    @PathVariable @Parameter(description = "ID của đường phố cần lấy thông tin", required = true) String id) {
    log.info("REST request to get road: {}", id);
    var response = roadUseCase.getRoadById(id);
    return Utils.returnOkResponse("Road retrieved successfully", response);
  }

  @GetMapping
  @Operation(summary = "Lấy danh sách Đường phố", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request lấy danh sách đường phố.
    2. Hỗ trợ phân trang qua tham số page, size, sort.
    3. Hỗ trợ search theo tên qua tham số keyword (contains, không phân biệt hoa thường).
    4. Trả về danh sách kết quả phân trang.""", parameters = {
    @Parameter(name = "page", description = "Số trang (bắt đầu từ 0)", example = "0"),
    @Parameter(name = "size", description = "Số lượng phần tử trên 1 trang", example = "10"),
    @Parameter(name = "sort", description = "Sắp xếp (VD: name,asc)", example = "name,asc"),
    @Parameter(name = "keyword", description = "Chuỗi search theo tên đường (contains, ignore case)", example = "Trần")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = RoadResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllRoads(
    @PageableDefault @Parameter(hidden = true) Pageable pageable,
    @RequestParam(required = false) String keyword) {
    log.info("REST request to get all roads with keyword: {}", keyword);
    var response = roadUseCase.getAllRoads(pageable, keyword);
    return Utils.returnOkResponse("Roads retrieved successfully", response);
  }
}
