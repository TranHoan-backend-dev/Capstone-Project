package com.capstone.auth.application.business.verification;

public interface VerificationService {
  String createOtp(String email);

  boolean verifyOtp(String email, String otp);

  void verifyAndResetPassword(String email, String otp, String newPassword);
}
