package com.capstone.auth.adapter;

import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.users.FilterUsersRequest;
import com.capstone.auth.application.dto.request.UpdateBusinessPageNamesRequest;
import com.capstone.auth.application.dto.request.users.UpdateRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.auth.application.usecase.ProfileUseCase;
import com.capstone.auth.application.usecase.UsersUseCase;
import com.capstone.common.utils.Utils;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
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

import java.util.List;

@AppLog
@RestController
@RequestMapping("/authorization")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('IT_STAFF')")
@Tag(name = "Authorization", description = "Các endpoints để quản lý ủy quyền và truy xuất thông tin nhân viên. Được xử lý bởi tài khoản có role là IT_STAFF")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthorizationController {
  UsersUseCase usersUseCase;
  UserService userService;
  ProfileUseCase profileUseCase;
  @NonFinal
  Logger log;

  // <editor-fold> desc="employee"
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
    @Parameter(description = "Filter criteria for users (isEnabled, username)") FilterUsersRequest request
  ) {
    log.info("Getting all employees with page index {} and page size {}", pageable.getPageNumber(),
      pageable.getPageSize());

    return Utils.returnOkResponse("Lấy danh sách nhân viên thành công",
      usersUseCase.getPaginatedListOfEmployees(pageable, request));
  }

  @GetMapping("/employees/{id}/name")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF')")
  public ResponseEntity<WrapperApiResponse> getEmployeeNameById(
    @PathVariable @NotBlank @NotEmpty @NotNull String id
  ) {
    log.info("Fetching employee name by id: {}", id);
    return Utils.returnOkResponse("Lấy tên nhân viên thành công", profileUseCase.getFullNameById(id));
  }

  @Operation(summary = "Kiểm tra sự tồn tại của nhân viên", description = """
    Kiểm tra xem nhân viên có tồn tại trong hệ thống hay không thông qua ID.

    Kết quả trả về là một giá trị boolean được bao bọc trong đối tượng WrapperApiResponse.

    Yêu cầu quyền hạn: 'IT_STAFF' hoặc 'ORDER_RECEIVING_STAFF'.
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Kiểm tra thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Boolean.class))),
    @ApiResponse(responseCode = "401", description = "Không được phép - Người dùng chưa đăng nhập", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Truy cập bị từ chối - Không đủ quyền hạn", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/employees/{authorId}")
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'ORDER_RECEIVING_STAFF')")
  public ResponseEntity<WrapperApiResponse> checkAuthorExisting(
    @Parameter(description = "ID của nhân viên cần kiểm tra", required = true)
    @PathVariable String authorId
  ) {
    log.info("Verifying existence of employee: {}", authorId);
    return Utils.returnOkResponse("Kiểm tra nhân viên thành công", usersUseCase.checkIfEmployeeExists(authorId));
  }

  @Operation(summary = "Cập nhật thông tin nhân viên", description = """
    Cập nhật các thông tin cơ bản của nhân viên bao gồm tên, phòng ban, số điện thoại, trạng thái hoạt động và chi nhánh cấp nước.

    Yêu cầu quyền hạn: 'IT_STAFF'.
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Cập nhật nhân viên thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = EmployeeResponse.class))),
    @ApiResponse(responseCode = "400", description = "Dữ liệu đầu vào không hợp lệ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy nhân viên", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PutMapping("/employees/{id}")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<?> updateEmployee(
    @PathVariable @NotBlank @NotEmpty @NotNull String id,
    @RequestBody UpdateRequest request
  ) {
    log.info("Updating employees");
    var response = usersUseCase.updateEmployee(id, request);
    log.info("Updated: {}", response);
    return Utils.returnOkResponse("Cập nhật nhân viên thành công", response);
  }

  @Operation(summary = "Xóa tài khoản nhân viên", description = """
    Vô hiệu hóa tài khoản nhân viên trong hệ thống. Thao tác này sẽ đặt trạng thái 'isEnabled' thành false và gửi email thông báo cho nhân viên.

    Yêu cầu quyền hạn: 'IT_STAFF'.
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Xóa nhân viên thành công"),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy nhân viên", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi hệ thống", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PreAuthorize("hasAuthority('IT_STAFF')")
  @DeleteMapping("/employees/{id}")
  public ResponseEntity<?> deleteEmployee(@PathVariable @NotBlank @NotEmpty @NotNull String id) {
    log.info("Deleting employee: {}", id);
    usersUseCase.deleteEmployee(id);
    return Utils.returnOkResponse("Xóa nhân viên thành công", null);
  }

  @Operation(hidden = true)
  @GetMapping("/employees/role/{id}")
  public ResponseEntity<?> getRoleOfEmployeeById(@PathVariable String id) {
    return Utils.returnOkResponse("", userService.getRoleOfEmployee(id));
  }
  // </editor-fold>

  // <editor-fold> desc="business pages"
  @Operation(summary = "Lấy các trang web nghiệp vụ được ủy quyền cho nhân viên", description = """
    Truy xuất danh sách tên các trang web nghiệp vụ mà nhân viên có ID được chỉ định được phép truy cập.

    API này được sử dụng để lấy các trang web/trang mà nhân viên có quyền truy cập.

    Truy vấn bằng ID nhân viên.
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đã truy xuất thành công danh sách các trang web nghiệp vụ được ủy quyền", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Object.class))),
    @ApiResponse(responseCode = "404", description = "Không tìm thấy nhân viên", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping("/employees/{empId}/pages")
  public ResponseEntity<WrapperApiResponse> getBusinessPageNamesOfEmployees(
    @Parameter(description = "ID của nhân viên", required = true)
    @PathVariable String empId
  ) {
    log.info("Getting pages of employee with id {}", empId);
    return Utils.returnOkResponse("Lấy danh sách trang nghiệp vụ thành công",
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
  public ResponseEntity<WrapperApiResponse> updateBusinessPageNamesOfEmployee(
    @Parameter(description = "Danh sách các yêu cầu cập nhật chứa ID nhân viên và bộ ID trang được ủy quyền mới của họ.", required = true)
    @RequestBody List<UpdateBusinessPageNamesRequest> request
  ) {
    log.info("Updating pages of employees");
    usersUseCase.updateBusinessPagesListOfEmployee(request);

    return Utils.returnOkResponse("Cập nhật trang nghiệp vụ thành công", null);
  }
  // </editor-fold>

  // <editor-fold> desc="job"
  @Operation(hidden = true)
  @GetMapping("/employees/jobs/{jobId}/assigned")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<WrapperApiResponse> isJobAssigned(@PathVariable String jobId) {
    log.info("Checking if job {} is assigned to any employee", jobId);
    return Utils.returnOkResponse("Kiểm tra gán việc thành công", usersUseCase.isJobAssigned(jobId));
  }
  // </editor-fold>
}
