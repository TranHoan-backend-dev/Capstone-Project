package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.business.verification.VerificationService;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.event.producer.message.OtpEvent;
import com.capstone.auth.infrastructure.service.keycloak.KeycloakService;
import com.capstone.auth.infrastructure.utils.Message;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpUseCaseTest {

  @Mock
  private VerificationService vSrv;

  @Mock
  private MessageProducer producer;

  @Mock
  private UserService uSrv;

  @Mock
  private ProfileService pSrv;

  @Mock
  private KeycloakService keycloakService;

  @Mock
  private Logger log;

  @InjectMocks
  private OtpUseCase otpUseCase;

  private static final String SUBJECT = "OTP Subject";
  private static final String TEMPLATE = "otp-template";
  private static final String ROUTING_KEY = "otp-key";

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(otpUseCase, "log", log);
    ReflectionTestUtils.setField(otpUseCase, "SUBJECT", SUBJECT);
    ReflectionTestUtils.setField(otpUseCase, "TEMPLATE", TEMPLATE);
    ReflectionTestUtils.setField(otpUseCase, "ROUTING_KEY", ROUTING_KEY);
  }

  @Test
  @DisplayName("Should send OTP successfully")
  void sendOtp_Success() {
    var email = "user@test.com";
    var otp = "123456";
    var profile = new ProfileDTO("id", "User Name", null, null, null, null, null);

    when(vSrv.createOtp(email)).thenReturn(otp);
    when(pSrv.getProfileByCredentials(email)).thenReturn(profile);

    otpUseCase.sendOtp(email);

    verify(producer).sendMessage(eq(ROUTING_KEY), argThat(event ->
      event instanceof OtpEvent &&
        ((OtpEvent) event).getOtp().equals(otp) &&
        ((OtpEvent) event).getName().equals("User Name")
    ));
  }

  @Test
  @DisplayName("Should send OTP with default name when profile not found")
  void sendOtp_ProfileNotFound() {
    var email = "unknown@test.com";
    var otp = "111222";

    when(vSrv.createOtp(email)).thenReturn(otp);
    when(pSrv.getProfileByCredentials(email)).thenReturn(null);

    otpUseCase.sendOtp(email);

    verify(producer).sendMessage(eq(ROUTING_KEY), argThat(event ->
      ((OtpEvent) event).getName().equals("Người dùng")
    ));
  }

  @Test
  @DisplayName("Should verify OTP successfully")
  void verifyOtp_Success() {
    var email = "test@test.com";
    var otp = "123";
    when(vSrv.verifyOtp(email, otp)).thenReturn(true);

    assertTrue(otpUseCase.verifyOtp(email, otp));
  }

  @Test
  @DisplayName("Should reset password on Keycloak")
  void resetPasswordWithOtp_Success() {
    var email = "test@test.com";
    var pass = "new-pass";
    var user = new UserDTO("uid", null, null, email, false, null, null, null, null, null, null, null, null, true);

    when(uSrv.getUserByEmail(email)).thenReturn(user);

    otpUseCase.resetPasswordWithOtp(email, "unused-here", pass);

    verify(keycloakService).updatePasswordOnKeycloak("uid", pass);
  }

  @Test
  @DisplayName("Should throw SE_11 when reset fails")
  void resetPasswordWithOtp_Fails() {
    var email = "fail@test.com";
    when(uSrv.getUserByEmail(email)).thenThrow(new RuntimeException());

    var ex = assertThrows(IllegalArgumentException.class, () ->
      otpUseCase.resetPasswordWithOtp(email, "otp", "pass"));

    assertEquals(Message.SE_11, ex.getMessage());
  }
}
