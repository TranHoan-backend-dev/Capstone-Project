package com.capstone.auth.application.usecase;

import org.springframework.stereotype.Component;

import com.capstone.auth.application.business.verification.VerificationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpUseCase {
    VerificationService vSrv;

    public void sendOtp(String email) {
        log.info("Sending OTP to email: {}", email);
        vSrv.sendOtp(email);
    }

    public boolean verifyOtp(String email, String otp) {
        log.info("Verifying OTP for email: {}", email);
        return vSrv.verifyOtp(email, otp);
    }

    public void resetPasswordWithOtp(String email, String otp, String newPassword) {
        log.info("Resetting password for email: {}", email);
        vSrv.verifyAndResetPassword(email, otp, newPassword);
    }
}
