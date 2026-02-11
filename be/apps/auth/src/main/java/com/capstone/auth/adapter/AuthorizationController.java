package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.FilterUsersRequest;
import com.capstone.auth.application.dto.request.UpdateBusinessPageNamesRequest;
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

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/authorization")
@RequiredArgsConstructor
@PreAuthorize("hasRole('IT_STAFF')")
@Tag(name = "Authorization", description = "Các endpoints để quản lý ủy quyền và truy xuất thông tin nhân viên. Được xử lý bởi tài khoản có role là IT_STAFF")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthorizationController {
  UsersUseCase usersUseCase;

  @Operation(summary = "Lấy tất cả nhân viên", description = """
    Truy xuất danh sách nhân viên được phân trang. Có thể tùy chọn lọc theo trạng thái 'isEnabled' và 'username'. Bạn có thể xem các trang của nhân viên có quyền truy cập bằng cách gọi endpoint /employees/{id}/pages\s

    Phản hồi được bao bọc trong WrapperApiResponse chứa dữ liệu được phân trang.

    Yêu cầu vai trò 'IT_STAFF'.
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đã truy xuất thành công danh sách nhân viên", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeResponse.class))),
    @ApiResponse(responseCode = "401", description = "Không được phép - Người dùng chưa được xác thực", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Bị cấm - Người dùng không có vai trò 'IT_STAFF' bắt buộc", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ - Đã xảy ra lỗi không mong muốn", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/employees")
  public ResponseEntity<WrapperApiResponse> getAllEmployees(
    @ParameterObject Pageable pageable,

    @Parameter(description = "Filter criteria for users (isEnabled, username)")
    FilterUsersRequest request
  ) {
    log.info("Getting all employees with page index {} and page size {}", pageable.getPageNumber(),
      pageable.getPageSize());

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Get all employees successfully",
      usersUseCase.getPaginatedListOfEmployees(pageable, request));
  }

  @Operation(summary = "Lấy các trang web nghiệp vụ được ủy quyền cho nhân viên", description = """
    Truy xuất danh sách tên các trang web nghiệp vụ mà nhân viên có ID được chỉ định được phép truy cập.

    API này được sử dụng để lấy các trang web/trang mà nhân viên có quyền truy cập.

    Truy vấn bằng ID nhân viên (đã mã hóa).
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đã truy xuất thành công danh sách các trang web nghiệp vụ được ủy quyền", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Object.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy nhân viên", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/employees/{empId}/pages")
  public ResponseEntity<WrapperApiResponse> getBusinessPageNamesOfEmployees(
    @Parameter(description = "ID được mã hóa của nhân viên", required = true)
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

  @Operation(summary = "Cập nhật các trang nghiệp vụ được ủy quyền cho nhiều nhân viên", description = """
    Cập nhật danh sách các trang web nghiệp vụ mà nhân viên cụ thể được phép truy cập.

    Endpoint này chấp nhận một danh sách các yêu cầu cập nhật, mỗi yêu cầu chỉ định ID nhân viên và tập hợp ID trang mới của họ.

    Thao tác này là giao dịch và idempotent cho từng nhân viên; nó thay thế danh sách truy cập hiện có bằng danh sách mới.

    Chỉ người dùng có vai trò 'IT_STAFF' mới có thể thực hiện hành động này."

    Dữ liệu payload phản hồi là null, chỉ thông báo là đã cập nhật thành công hay chưa
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đã cập nhật thành công các trang nghiệp vụ cho nhân viên"),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ - Dữ liệu đầu vào không hợp lệ (ví dụ: JSON sai định dạng, thiếu các trường bắt buộc)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Không được phép - Người dùng chưa được xác thực", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Bị cấm - Người dùng không có vai trò 'IT_STAFF' bắt buộc", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ - Đã xảy ra lỗi không mong muốn trong quá trình cập nhật", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PutMapping("employees/pages")
  public ResponseEntity<WrapperApiResponse> updateBusinessPageNamesOfEmployees(
    @Parameter(description = "Danh sách các yêu cầu cập nhật chứa ID nhân viên và bộ ID trang được ủy quyền mới của họ.", required = true)
    @RequestBody
    List<UpdateBusinessPageNamesRequest> request
  ) {
    log.info("Updating pages of employees");
    usersUseCase.updateBusinessPagesListOfEmployees(request);

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Update pages successfully",
      null);
  }
}
