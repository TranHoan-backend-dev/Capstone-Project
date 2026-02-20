package com.capstone.construction.adapter.catalog;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.usecase.catalog.CommuneUseCase;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/communes")
@RequiredArgsConstructor
// TODO: unit test
@Tag(name = "Quản lý Xã/Phường", description = "Các API quản lý danh mục Xã/Phường (Commune)")
public class CommuneController {
  private final CommuneUseCase communeUseCase;

  @PostMapping
  @Operation(summary = "Tạo mới Xã/Phường", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request chứa thông tin tạo mới xã/phường (tên, mã, ...).
    2. Hệ thống validate DTO đầu vào (NotNull, NotBlank, ...).
    3. Hệ thống kiểm tra quyền truy cập (Yêu cầu quyền 'IT_STAFF').
    4. Gọi UseCase để xử lý logic lưu trữ dữ liệu.
    5. Trả về response thành công hoặc lỗi tương ứng.

    **Yêu cầu bảo mật:**
    - Bearer Token hợp lệ.
    - User có quyền `IT_STAFF`.""", responses = {
    @ApiResponse(responseCode = "201", description = "Tạo mới xã/phường thành công"),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ (Validation error)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Chưa xác thực (Unauthorized)", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Truy cập bị từ chối (Forbidden) - Sai quyền", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi nội bộ hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> createCommune(@RequestBody @Valid CommuneRequest request) {
    log.info("REST request to create commune: {}", request.name());
    communeUseCase.createCommune(request);
    return Utils.returnCreatedResponse("Commune created successfully");
  }

  @PutMapping("/{id}")
  @Operation(summary = "Cập nhật Xã/Phường", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request cập nhật với ID cụ thể.
    2. Validate ID và thông tin body (CommuneRequest).
    3. Kiểm tra quyền 'IT_STAFF'.
    4. Gọi UseCase để thực hiện cập nhật.
    5. Trả về kết quả sau khi cập nhật""", parameters = {
    @Parameter(name = "id", description = "ID của xã/phường cần cập nhật", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Cập nhật thành công", content = @Content(schema = @Schema(implementation = CommuneResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy xã/phường", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateCommune(
    @PathVariable @Parameter(description = "ID của xã/phường cần cập nhật") String id,
    @RequestBody @Valid CommuneRequest request) {
    log.info("REST request to update commune: {}", id);
    var response = communeUseCase.updateCommune(id, request);
    return Utils.returnOkResponse("Commune updated successfully", response);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Xóa Xã/Phường", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request xóa với ID.
    2. Kiểm tra quyền truy cập.
    3. Gọi UseCase xóa bản ghi""", parameters = {
    @Parameter(name = "id", description = "ID của xã/phường cần xóa", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Xóa thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy xã/phường", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> deleteCommune(
    @PathVariable @Parameter(description = "ID của xã/phường cần xóa") String id) {
    log.info("REST request to delete commune: {}", id);
    communeUseCase.deleteCommune(id);
    return Utils.returnOkResponse("Commune deleted successfully", null);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Lấy chi tiết Xã/Phường", description = """
    **Luồng nghiệp vụ:**
    1. Client gửi request lấy thông tin chi tiết với ID.
    2. Hệ thống tìm kiếm bản ghi trong database.
    3. Trả về thông tin chi tiết nếu tìm thấy""", parameters = {
    @Parameter(name = "id", description = "ID của xã/phường cần lấy thông tin", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
  }, responses = {
    @ApiResponse(responseCode = "200", description = "Lấy thông tin thành công", content = @Content(schema = @Schema(implementation = CommuneResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy xã/phường", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getCommuneById(
    @PathVariable @Parameter(description = "ID của xã/phường cần lấy thông tin") String id) {
    log.info("REST request to get commune: {}", id);
    var response = communeUseCase.getCommuneById(id);
    return Utils.returnOkResponse("Commune retrieved successfully", response);
  }

  @GetMapping
  @Operation(summary = "", description = "", responses = {
    @ApiResponse(responseCode = "200", description = "", content = @Content(schema = @Schema(implementation = CommuneResponse.class)))
  })
  public ResponseEntity<WrapperApiResponse> getAllCommunes(
    @PageableDefault @Parameter(description = "") Pageable pageable) {
    log.info("REST request to get all communes");
    var response = communeUseCase.getAllCommunes(pageable);
    return Utils.returnOkResponse("Communes retrieved successfully", response);
  }
}
