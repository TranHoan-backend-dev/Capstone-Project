package com.capstone.auth.adapter;

import com.capstone.auth.application.dto.request.CheckExistenceRequest;
import com.capstone.auth.application.dto.request.CredentialsRequest;
import com.capstone.auth.application.dto.request.RefreshTokenRequest;
import com.capstone.auth.application.dto.request.otp.SendOtpRequest;
import com.capstone.auth.application.dto.request.otp.VerifyOtpRequest;
import com.capstone.auth.application.dto.request.password.ChangePasswordRequest;
import com.capstone.auth.application.dto.request.password.ResetPasswordRequest;
import com.capstone.auth.application.dto.request.users.NewUserRequest;
import com.capstone.auth.application.dto.response.UserProfileResponse;
import com.capstone.auth.application.usecase.AuthUseCase;
import com.capstone.auth.application.usecase.OtpUseCase;
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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@SecurityRequirement(name = "Keycloak")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "Các hoạt động xác thực người dùng, đăng ký tài khoản, OTP, quên-đổi mật khẩu.")
public class AuthenticationController {
  AuthUseCase authUC;
  OtpUseCase otpUC;
  @NonFinal
  Logger log;

  @Operation(summary = "Đăng ký tài khoản mới", description = "Đăng ký tài khoản người dùng mới với thông tin nhân viên bao gồm vai trò, phòng ban và mạng lưới cấp nước. Trả về WrapperApiResponse với data là null.")
  @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Thông tin chi tiết cho tài khoản người dùng mới", required = true, content = @Content(schema = @Schema(implementation = NewUserRequest.class)))
  @ApiResponses(value = {
    @ApiResponse(responseCode = "200", description = "Đăng ký thành công"),
    @ApiResponse(responseCode = "400", description = "Yêu cầu không hợp lệ - Xác thực thất bại hoặc tài khoản đã tồn tại", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class))),
    @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @PostMapping("/signup")
  @PreAuthorize("hasAuthority('IT_STAFF')")
  public ResponseEntity<?> signup(@RequestBody @Valid NewUserRequest request)
    throws ExecutionException, InterruptedException {
    log.info("Signup request comes to endpoint: {}", request);

    authUC.register(request);

    return Utils.returnOkResponse("Tạo tài khoản thành công", null);
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
    return Utils.returnOkResponse("Kiểm tra thành công", authUC.checkExistence(request.value()));
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
    return Utils.returnOkResponse("Gửi mã OTP thành công", null);
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
    return Utils.returnOkResponse(!isValid ? "Mã OTP không hợp lệ" : "Xác minh mã OTP thành công", null);
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
    return Utils.returnOkResponse("Đặt lại mật khẩu thành công", null);
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
    authUC.changePassword(jwt.getSubject(), email.toString(), request.oldPassword(), request.newPassword());

    return Utils.returnOkResponse("Đổi mật khẩu thành công", null);
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
  public ResponseEntity<?> login(@RequestBody CredentialsRequest request, HttpServletRequest httpRequest) {
    log.info("Login request comes to endpoint: {}", request);

    // Nếu request body không có device info, lấy từ headers
    var deviceInfo = request.deviceInfo() != null ? request.deviceInfo() : httpRequest.getHeader("User-Agent");
    log.info("Device info: {}", deviceInfo);
    var ipAddress = request.ipAddress() != null ? request.ipAddress() : httpRequest.getRemoteAddr();
    log.info("Ip address: {}", ipAddress);
    var deviceId = request.deviceId(); // client side nên gửi deviceId
    log.info("Device id: {}", deviceId);

    var response = authUC.login(request.username(), request.password(), deviceId, deviceInfo, ipAddress);
    return Utils.returnOkResponse("Đăng nhập thành công", response);
  }

  @PostMapping("/refresh-token")
  public ResponseEntity<?> getToken(@RequestBody RefreshTokenRequest request) {
    log.info("Get refresh token");
    return Utils.returnOkResponse("", authUC.refreshToken(request.token()));
  }

  @Operation(summary = "Đăng xuất", description = "Đăng xuất người dùng bằng cách hủy bỏ refresh token trên Keycloak. Data response rỗng.")
  @PostMapping("/logout")
  public ResponseEntity<?> logout(@RequestBody @Valid RefreshTokenRequest request) {
    log.info("Logout request");
    authUC.logout(request.token());
    return Utils.returnOkResponse("Đăng xuất thành công", null);
  }
}
