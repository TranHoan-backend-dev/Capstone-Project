package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.UpdateProfileRequest;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.usecase.ProfileUseCase;
import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/me")
@SecurityRequirement(name = "Keycloak")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "Các hoạt động lấy và chỉnh sửa hồ sơ người dùng.")
public class ProfileController {
  ProfileUseCase profileUC;
  @NonFinal
  Logger log;

  @Operation(summary = "Lấy hồ sơ người dùng hiện tại", description = """
    Truy xuất hồ sơ của người dùng hiện đang được xác thực dựa trên token JWT truyền về trong header Authorization.

    Luồng:
    1. Trích xuất ID người dùng (subject) và claims (email, tên người dùng ưu tiên) từ JWT.
    2. Xác thực rằng tài khoản liên kết với ID tồn tại và không bị khóa/vô hiệu hóa.
    3. Xác minh rằng email và tên người dùng trong token khớp với hồ sơ trong cơ sở dữ liệu.
    4. Trả về thông tin hồ sơ của người dùng.
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Hồ sơ đã được truy xuất thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ - Claims trong token (email/tên người dùng) không khớp với hồ sơ cơ sở dữ liệu hoặc không hợp lệ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Không được phép - Token JWT hợp lệ bị thiếu hoặc đã hết hạn", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Bị cấm - Tài khoản người dùng bị khóa hoặc vô hiệu hóa", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ - Đã xảy ra lỗi không mong muốn", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))})
  @GetMapping()
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', " +
    "'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'FINANCE_DEPARTMENT', " +
    "'CONSTRUCTION_DEPARTMENT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'BUSINESS_DEPARTMENT_HEAD'" +
    ", 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> me(@AuthenticationPrincipal Jwt jwt) {
    var id = jwt.getSubject();

    Map<String, Object> claims = jwt.getClaims();
    log.info("Get profile request comes to endpoint: {}", id);

    return Utils.returnOkResponse("Lấy thông tin hồ sơ người dùng thành công", profileUC.getMe(
      id,
      claims.get("email").toString(),
      claims.get("preferred_username").toString()));
  }

  @Operation(summary = "Cập nhật hồ sơ người dùng hiện tại", description = """
    Cập nhật thông tin hồ sơ của người dùng hiện đang được xác thực.

    Các trường như họ tên, số điện thoại và ngày sinh được xác thực trước khi cập nhật.

    Chỉ các trường được cung cấp khác null mới được cập nhật; các trường khác giữ nguyên giá trị hiện tại.
    """)
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Hồ sơ đã được cập nhật thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ - Xác thực thất bại đối với một hoặc nhiều trường (ví dụ: định dạng điện thoại không hợp lệ, ngày không hợp lệ)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Không được phép - Token JWT hợp lệ bị thiếu hoặc đã hết hạn", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Bị cấm - Tài khoản người dùng bị khóa hoặc vô hiệu hóa", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ - Đã xảy ra lỗi không mong muốn", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))})
  @PatchMapping()
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', " +
    "'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'FINANCE_DEPARTMENT', " +
    "'CONSTRUCTION_DEPARTMENT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'BUSINESS_DEPARTMENT_HEAD'" +
    ", 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateProfile(
    @AuthenticationPrincipal Jwt jwt,
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin hồ sơ cập nhật", required = true, content = @Content(schema = @Schema(implementation = UpdateProfileRequest.class))) @NonNull @RequestBody UpdateProfileRequest request) {
    var id = jwt.getSubject();
    log.info("User's id: {}", id);
    var response = profileUC.updateProfile(id, request);

    return Utils.returnOkResponse("Cập nhật hồ sơ người dùng thành công", response);
  }

  @Operation(summary = "Cập nhật ảnh đại diện người dùng", description = """
    Cập nhật ảnh đại diện của người dùng hiện đang được xác thực.

    Tệp ảnh đại diện được tải lên qua multipart form data và được lưu trữ trong bộ nhớ đám mây.

    Luồng:
    1. Xác thực người dùng không bị khóa/vô hiệu hóa.
    2. Tải tệp ảnh đại diện lên Google Cloud Storage.
    3. Cập nhật URL ảnh đại diện của người dùng trong cơ sở dữ liệu.
    4. Trả về thông tin hồ sơ người dùng đã cập nhật.
    """)
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "File ảnh đại diện của người dùng", required = true, content = @Content(schema = @Schema(implementation = MultipartFile.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Ảnh đại diện đã được cập nhật thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ - Định dạng tệp không hợp lệ hoặc tải lên tệp thất bại", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Không được phép - Token JWT hợp lệ bị thiếu hoặc đã hết hạn", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Bị cấm - Tài khoản người dùng bị khóa hoặc vô hiệu hóa", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ - Đã xảy ra lỗi không mong muốn trong quá trình tải lên ảnh đại diện", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))})
  @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @PreAuthorize("hasAnyAuthority('IT_STAFF', 'SURVEY_STAFF', 'ORDER_RECEIVING_STAFF', " +
    "'PLANNING_TECHNICAL_DEPARTMENT_HEAD', 'COMPANY_LEADERSHIP', 'FINANCE_DEPARTMENT', " +
    "'CONSTRUCTION_DEPARTMENT_STAFF', 'CONSTRUCTION_DEPARTMENT_HEAD', 'BUSINESS_DEPARTMENT_HEAD'" +
    ", 'METER_INSPECTION_STAFF')")
  public ResponseEntity<WrapperApiResponse> updateAvatar(
    @AuthenticationPrincipal Jwt jwt,
    @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Tệp ảnh đại diện để tải lên. Các định dạng hỗ trợ: JPEG, PNG, GIF", required = true) @RequestParam(value = "avatar") MultipartFile file) {
    log.info("Update avatar with file is {}", file == null ? "null" : "not null");

    var id = jwt.getSubject();
    log.info("Update avatar of user that has id: {}", id);

    return Utils.returnOkResponse("Cập nhật ảnh đại diện thành công", profileUC.updateAvatar(id, file));
  }
}
