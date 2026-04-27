package com.capstone.auth.application.business.verification;

import com.capstone.auth.domain.model.utils.VerificationCode;
import com.capstone.auth.infrastructure.persistence.VerificationCodeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VerificationServiceImplTest {

  @Mock
  private VerificationCodeRepository repo;

  @Mock
  private Logger log;

  @InjectMocks
  private VerificationServiceImpl verificationService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(verificationService, "log", log);
  }

  @Test
  @DisplayName("Should create OTP successfully for new email")
  void createOtp_Success_NewEmail() {
    var email = "test@example.com";
    when(repo.findByEmail(email)).thenReturn(Optional.empty());

    var otp = verificationService.createOtp(email);

    assertNotNull(otp);
    assertEquals(6, otp.length());
    verify(repo).save(any(VerificationCode.class));
  }

  @Test
  @DisplayName("Should throw exception when email is blocked")
  void createOtp_Fails_Blocked() {
    var email = "blocked@example.com";
    var code = VerificationCode.builder()
        .email(email)
        .blockedUntil(LocalDateTime.now().plusMinutes(10))
        .build();
    when(repo.findByEmail(email)).thenReturn(Optional.of(code));

    var ex = assertThrows(IllegalArgumentException.class, () -> verificationService.createOtp(email));
    assertTrue(ex.getMessage().contains("Too many attempts"));
  }

  @Test
  @DisplayName("Should block user after 5 attempts")
  void createOtp_Blocks_AfterMaxAttempts() {
    var email = "limit@example.com";
    var code = VerificationCode.builder()
        .email(email)
        .attemptCount(5)
        .build();
    when(repo.findByEmail(email)).thenReturn(Optional.of(code));

    var ex = assertThrows(IllegalArgumentException.class, () -> verificationService.createOtp(email));
    assertEquals("Too many attempts. Please wait 30 minutes.", ex.getMessage());
    verify(repo).save(argThat(c -> c.getBlockedUntil() != null));
  }

  @Test
  @DisplayName("Should reset attempt count after 30 minutes")
  void createOtp_Resets_AfterCooldown() {
    var email = "cooldown@example.com";
    var code = VerificationCode.builder()
        .email(email)
        .attemptCount(5)
        .lastGeneratedTime(LocalDateTime.now().minusMinutes(31))
        .build();
    when(repo.findByEmail(email)).thenReturn(Optional.of(code));

    var otp = verificationService.createOtp(email);

    assertNotNull(otp);
    verify(repo).save(argThat(c -> c.getAttemptCount() == 1));
  }

  @Test
  @DisplayName("Should verify OTP successfully")
  void verifyOtp_Success() {
    var email = "test@example.com";
    var otp = "123456";
    var code = VerificationCode.builder()
        .email(email)
        .otpCode(otp)
        .expiredAt(LocalDateTime.now().plusMinutes(5))
        .build();
    when(repo.findByEmail(email)).thenReturn(Optional.of(code));

    assertTrue(verificationService.verifyOtp(email, otp));
  }

  @Test
  @DisplayName("Should return false for incorrect OTP")
  void verifyOtp_WrongOtp() {
    var email = "test@example.com";
    var code = VerificationCode.builder()
        .email(email)
        .otpCode("111111")
        .expiredAt(LocalDateTime.now().plusMinutes(5))
        .build();
    when(repo.findByEmail(email)).thenReturn(Optional.of(code));

    assertFalse(verificationService.verifyOtp(email, "222222"));
  }

  @Test
  @DisplayName("Should throw exception for expired OTP")
  void verifyOtp_Expired() {
    var email = "expired@example.com";
    var code = VerificationCode.builder()
        .email(email)
        .expiredAt(LocalDateTime.now().minusMinutes(1))
        .build();
    when(repo.findByEmail(email)).thenReturn(Optional.of(code));

    var ex = assertThrows(IllegalArgumentException.class, () -> verificationService.verifyOtp(email, "123456"));
    assertEquals("OTP has expired", ex.getMessage());
  }

  @Test
  @DisplayName("Should verify and reset password")
  void verifyAndResetPassword_Success() {
    var email = "reset@example.com";
    var otp = "654321";
    var code = VerificationCode.builder()
        .email(email)
        .otpCode(otp)
        .expiredAt(LocalDateTime.now().plusMinutes(5))
        .build();
    when(repo.findByEmail(email)).thenReturn(Optional.of(code));

    verificationService.verifyAndResetPassword(email, otp, "new-pass");

    assertEquals("", code.getOtpCode());
    verify(repo).save(code);
  }
}
