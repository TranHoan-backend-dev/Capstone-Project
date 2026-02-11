package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.ChangePasswordRequest;
import com.capstone.auth.application.dto.request.CheckExistenceRequest;
import com.capstone.auth.application.dto.request.ResetPasswordRequest;
import com.capstone.auth.application.dto.request.SendOtpRequest;
import com.capstone.auth.application.dto.request.SignupRequest;
import com.capstone.auth.application.dto.request.VerifyOtpRequest;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.application.usecase.AuthUseCase;
import com.capstone.auth.application.usecase.OtpUseCase;

import com.capstone.auth.infrastructure.utils.Utils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@SecurityRequirement(name = "Keycloak")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "Các hoạt động xác thực người dùng, đăng ký tài khoản, OTP, quên-đổi mật khẩu.")
public class AuthenticationController {
  AuthUseCase authUC;
  OtpUseCase otpUC;

  @Operation(summary = "Đăng ký tài khoản mới", description = "Đăng ký tài khoản người dùng mới với thông tin nhân viên bao gồm vai trò, phòng ban và mạng lưới cấp nước. Trả về WrapperApiResponse với data là null.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin chi tiết cho tài khoản người dùng mới", required = true, content = @Content(schema = @Schema(implementation = SignupRequest.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đăng ký thành công", content = @Content(mediaType = "application/json")),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ - Xác thực thất bại hoặc tài khoản đã tồn tại", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest request)
    throws ExecutionException, InterruptedException {
    log.info("Signup request comes to endpoint: {}", request);

    authUC.register(
      request.username(), request.password(),
      request.email(), request.roleId(), request.fullname(),
      request.jobId(), request.businessPageIds(),
      request.departmentId(), request.waterSupplyNetworkId());

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Create account successfully",
      null);
  }

  // <editor-fold> desc="Forgot password"
  @Operation(summary = "Kiểm tra xem tên đăng nhập hoặc email", description = "Kiểm tra xem tên đăng nhập hoặc email đã được sử dụng trong hệ thống hoặc tồn tại hay chưa.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Kiểm tra thành công. Trả về WrapperApiResponse với data là giá trị boolean.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Boolean.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/check-existence")
  public ResponseEntity<?> checkExistence(
    @RequestBody @Valid CheckExistenceRequest request) {
    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Check existence successfully",
      authUC.checkExistence(request.value()));
  }

  @Operation(summary = "Gửi OTP qua email", description = "Gửi mã OTP đến email được cung cấp để xác minh hoặc đặt lại mật khẩu. Data response rỗng.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Địa chỉ email của tài khoản cần gửi OTP", required = true, content = @Content(schema = @Schema(implementation = SendOtpRequest.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "OTP đã được gửi thành công"),
    @ApiResponse(responseCode = "400", description = "Email không hợp lệ hoặc không tồn tại", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/send-otp")
  public ResponseEntity<?> sendOtp(@RequestBody @Valid SendOtpRequest request) {
    otpUC.sendOtp(request.email());
    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Send OTP successfully",
      null,
      LocalDateTime.now()));
  }

  @Operation(summary = "Xác minh mã OTP", description = "Xác minh tính hợp lệ của mã OTP được gửi qua email. Data response rỗng.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Địa chỉ email và mã OTP cần xác minh", required = true, content = @Content(schema = @Schema(implementation = VerifyOtpRequest.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "OTP đã được xác minh thành công"),
    @ApiResponse(responseCode = "400", description = "Mã OTP không hợp lệ hoặc đã hết hạn", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/verify-otp")
  public ResponseEntity<?> verifyOtp(@RequestBody @Valid VerifyOtpRequest request) {
    var isValid = otpUC.verifyOtp(request.email(), request.otp());
    // if not valid, the service might return false or throw exception.
    // Implementation in service returns boolean without exception for mismatch, but
    // exception for expiry/not found.
    // Let's handle the boolean false case.

    return Utils.returnResponse(
      !isValid ? HttpStatus.BAD_REQUEST.value() : HttpStatus.OK.value(),
      !isValid ? "Invalid OTP" : "Verify OTP successfully",
      null);
  }
  // </editor-fold>

  @Operation(summary = "Đặt lại mật khẩu với OTP", description = "Cho phép người dùng đặt mật khẩu mới sau khi xác minh OTP thành công. Data response rỗng.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Địa chỉ email, mã OTP và mật khẩu mới cần đặt lại", required = true, content = @Content(schema = @Schema(implementation = ResetPasswordRequest.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đặt lại mật khẩu thành công"),
    @ApiResponse(responseCode = "400", description = "OTP không hợp lệ hoặc dữ liệu không chính xác", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
    otpUC.resetPasswordWithOtp(request.email(), request.otp(), request.newPassword());
    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Reset password successfully",
      null);
  }

  @Operation(summary = "Đổi mật khẩu (Đã xác thực)", description = "Thay đổi mật khẩu cho người dùng hiện đang đăng nhập. Yêu cầu mật khẩu cũ và mật khẩu mới. Data response rỗng.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Mật khẩu cũ, mật khẩu mới và xác nhận mật khẩu", required = true, content = @Content(schema = @Schema(implementation = ChangePasswordRequest.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Mật khẩu đã được thay đổi thành công"),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ - Mật khẩu cũ không chính xác hoặc mật khẩu mới không khớp", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "401", description = "Không được phép - Token JWT không hợp lệ hoặc bị thiếu", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(
    @AuthenticationPrincipal Jwt jwt,
    @RequestBody @Valid ChangePasswordRequest request) {
    log.info("Change password request comes to endpoint: {}", jwt);
    var email = jwt.getClaim("email");
    authUC.changePassword(email.toString(), request.oldPassword(), request.newPassword(),
      request.confirmPassword());

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Change password successfully",
      null);
  }

  @Operation(summary = "Đăng nhập bằng JWT", description = "Xác thực người dùng sử dụng token JWT từ header Authorization. "
    +
    "Nó trích xuất claims của người dùng (email, tên người dùng ưu tiên), xác thực sự tồn tại của người dùng, trạng thái tài khoản (không bị xóa, khóa hoặc vô hiệu hóa) và tính nhất quán dữ liệu với cơ sở dữ liệu. "
    +
    "Trả về wrapper thành công chứa thông tin hồ sơ người dùng (UserProfileResponse) trong trường 'data' nếu thành công.")
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đăng nhập thành công. Trả về WrapperApiResponse với data là đối tượng UserProfileResponse chứa thông tin cá nhân.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ - Claims không hợp lệ hoặc dữ liệu người dùng không khớp", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "403", description = "Bị cấm - Tài khoản bị xóa, vô hiệu hóa hoặc bị khóa", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/login")
  public ResponseEntity<?> login(@AuthenticationPrincipal Jwt jwt) {
    var id = jwt.getSubject();
    Map<String, Object> claims = jwt.getClaims(); // username, prefered_username, realm_access->roles

    return Utils.returnResponse(
      HttpStatus.OK.value(),
      "Login successfully",
      authUC.login(
        id,
        claims.get("email").toString(),
        claims.get("preferred_username").toString()));
  }
}
