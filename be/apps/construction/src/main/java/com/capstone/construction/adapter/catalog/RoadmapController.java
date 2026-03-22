package com.capstone.construction.adapter.catalog;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.usecase.catalog.RoadmapUseCase;
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
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@AppLog
@RestController
@RequestMapping("/roadmaps")
@RequiredArgsConstructor
@Tag(name = "Quản lý Lộ trình ghi", description = "Các API quản lý Lộ trình ghi (Roadmap)")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoadmapController {
  final RoadmapUseCase roadmapUseCase;
  Logger log;

  @PostMapping
  @Operation(summary = "Tạo mới Lộ trình ghi", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request chứa thông tin tạo mới lộ trình ghi (tên, thông số, ...).
    2. Hệ thống validate DTO đầu vào.
    3. Hệ thống kiểm tra quyền truy cập (Yêu cầu quyền 'IT_STAFF').
    4. Gọi UseCase để xử lý logic lưu trữ dữ liệu.
    5. Trả về response thành công hoặc lỗi tương ứng.

    **Yêu cầu bảo mật:**
    - Bearer Token hợp lệ.
    - User có quyền `IT_STAFF`.""", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo mới lộ trình ghi thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ (Validation error)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Chưa xác thực (Unauthorized)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Truy cập bị từ chối (Forbidden) - Sai quyền", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi nội bộ hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createRoadmap(@RequestBody @Valid RoadmapRequest request) {
    log.info("REST request to create roadmap: {}", request.name());
    var response = roadmapUseCase.createRoadmap(request);
    log.info("Created roadmap: {}", response);
    return Utils.returnCreatedResponse("Tạo lộ trình ghi thành công");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật Lộ trình ghi", description = """
        **Luồng nghiệp vụ:**
        1. Client gửi request cập nhật với ID cụ thể.
        2. Validate ID và thông tin body (RoadmapRequest).
        3. Kiểm tra quyền 'IT_STAFF'.
        4. Gọi UseCase để thực hiện cập nhật.
        5. Trả về kết quả sau khi cập nhật.
    """, parameters = {
    @Parameter(name = "id", description = "ID của lộ trình ghi cần cập nhật", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = RoadmapResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy lộ trình ghi", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateRoadmap(
    @PathVariable @Parameter(description = "ID của lộ trình ghi cần cập nhật", required = true) String id,
    @RequestBody @Valid RoadmapRequest request) {
    log.info("REST request to update roadmap: {}", id);
    var response = roadmapUseCase.updateRoadmap(id, request);
    return Utils.returnOkResponse("Cập nhật lộ trình ghi thành công", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Xóa Lộ trình ghi", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request xóa với ID.
    2. Kiểm tra quyền truy cập.
    3. Gọi UseCase xóa bản ghi.
    4. Trả về 200 OK nếu thành công.""", parameters = {
    @Parameter(name = "id", description = "ID của lộ trình ghi cần xóa", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Xóa thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy lộ trình ghi", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteRoadmap(
    @PathVariable @Parameter(description = "ID của lộ trình ghi cần xóa", required = true) String id) {
    log.info("REST request to delete roadmap: {}", id);
    roadmapUseCase.deleteRoadmap(id);
    return Utils.returnOkResponse("Xóa lộ trình ghi thành công", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy chi tiết Lộ trình ghi", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request lấy thông tin chi tiết với ID.
    2. Hệ thống tìm kiếm bản ghi trong database.
    3. Trả về thông tin chi tiết nếu tìm thấy.
    4. Trả về lỗi 404 nếu không tìm thấy.""", parameters = {
    @Parameter(name = "id", description = "ID của lộ trình ghi cần lấy thông tin", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công", content = @Content(schema = @Schema(implementation = RoadmapResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy lộ trình ghi", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getRoadmapById(
    @PathVariable @Parameter(description = "ID của lộ trình ghi cần lấy thông tin", required = true) String id) {
    log.info("REST request to get roadmap: {}", id);
    var response = roadmapUseCase.getRoadmapById(id);
    return Utils.returnOkResponse("Lấy thông tin lộ trình ghi thành công", response);
  }

  @GetMapping
  @Operation(summary = "Lấy danh sách Lộ trình ghi", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request lấy danh sách lộ trình ghi.
    2. Hỗ trợ phân trang qua tham số page, size, sort.
    3. Trả về danh sách kết quả phân trang.""", parameters = {
    @Parameter(name = "page", description = "Số trang (bắt đầu từ 0)", example = "0"),
    @Parameter(name = "size", description = "Số lượng phần tử trên 1 trang", example = "10"),
    @Parameter(name = "sort", description = "Sắp xếp (VD: name,asc)", example = "name,asc")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(schema = @Schema(implementation = RoadmapResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllRoadmaps(
    @PageableDefault @Parameter(hidden = true) Pageable pageable,
    @RequestParam(required = false)
    @Parameter(description = "Từ khóa tìm kiếm theo tên lộ trình ghi") String keyword,
    @RequestParam(required = false)
    @Parameter(description = "Lọc theo ID tuyến ống (lateral)") String lateralId,
    @RequestParam(required = false)
    @Parameter(description = "Lọc theo ID mạng lưới cấp nước") String networkId
  ) {
    log.info("REST request to get all roadmaps with pagination: {}, keyword: {}, lateralId: {}, networkId: {}", pageable, keyword, lateralId, networkId);
    var response = roadmapUseCase.getAllRoadmaps(pageable, keyword, lateralId, networkId);
    return Utils.returnOkResponse("Lấy danh sách lộ trình ghi thành công", response);
  }

  @PatchMapping("/{id}/assign/{staffId}")
  @Operation(summary = "Gán nhân viên ghi thu cho lộ trình", description = """
    **Luồng nghiệp vụ:**
    1. Gán nhân viên phòng kinh doanh (METER_INSPECTION_STAFF) cho lộ trình ghi.
    2. Gửi thông báo cho nhân viên được gán.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Gán thành công"),
    @ApiResponse(responseCode = "403", description = "Không có quyền")
  })
  @PreAuthorize("hasAnyAuthority('BUSINESS_DEPARTMENT_HEAD', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> assignStaff(@PathVariable String id, @PathVariable String staffId) {
    log.info("REST request to assign staff {} to roadmap {}", staffId, id);
    var response = roadmapUseCase.assignStaff(id, staffId);
    return Utils.returnOkResponse("Gán nhân viên thành công", response);
  }

  @PatchMapping("/{id}/cancel-assignment")
  @Operation(summary = "Hủy phân công lộ trình", description = """
    **Luồng nghiệp vụ:**
    1. Hủy gán nhân viên cho lộ trình ghi.
    2. Gửi thông báo cho nhân viên cũ.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Hủy thành công"),
    @ApiResponse(responseCode = "403", description = "Không có quyền")
  })
  @PreAuthorize("hasAnyAuthority('BUSINESS_DEPARTMENT_HEAD', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> cancelAssignment(@PathVariable String id) {
    log.info("REST request to cancel assignment for roadmap {}", id);
    var response = roadmapUseCase.cancelAssignment(id);
    return Utils.returnOkResponse("Hủy phân công thành công", response);
  }

  @PatchMapping("/{id}/update-assignment/{staffId}")
  @Operation(summary = "Cập nhật phân công lộ trình", description = """
    **Luồng nghiệp vụ:**
    1. Cập nhật nhân viên mới cho lộ trình.
    2. Gửi thông báo cho cả nhân viên cũ và mới.
    """, responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công"),
    @ApiResponse(responseCode = "403", description = "Không có quyền")
  })
  @PreAuthorize("hasAnyAuthority('BUSINESS_DEPARTMENT_HEAD', 'IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateAssignment(@PathVariable String id, @PathVariable String staffId) {
    log.info("REST request to update assignment for roadmap {} to staff {}", id, staffId);
    var response = roadmapUseCase.updateAssignment(id, staffId);
    return Utils.returnOkResponse("Cập nhật phân công thành công", response);
  }
}
