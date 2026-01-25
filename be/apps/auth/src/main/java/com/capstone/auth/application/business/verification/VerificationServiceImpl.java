package com.capstone.auth.application.business.verification;

import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.event.producer.OtpEvent;
import com.capstone.auth.domain.model.VerificationCode;
import com.capstone.auth.domain.repository.VerificationCodeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VerificationServiceImpl implements VerificationService {
    VerificationCodeRepository repo;
    MessageProducer producer;
    UserService uSrv;

    @NonFinal
    @Value("${sending_mail.otp_verification.subject}")
    String SUBJECT;

    @NonFinal
    @Value("${sending_mail.otp_verification.template}")
    String TEMPLATE;

    @Override
    public void sendOtp(String email) {
        log.info("Sending OTP to email: {}", email);

        var verificationCode = repo.findByEmail(email).orElse(VerificationCode.builder()
                .email(email)
                .attemptCount(0)
                .build());

        // Check blockage
        if (verificationCode.getBlockedUntil() != null
                && verificationCode.getBlockedUntil().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Too many attempts. Please wait until " + verificationCode.getBlockedUntil());
        }

        // Reset attempt count if 30m passed
        if (verificationCode.getLastGeneratedTime() != null &&
                verificationCode.getLastGeneratedTime().plusMinutes(30).isBefore(LocalDateTime.now())) {
            verificationCode.setAttemptCount(0);
        }

        // Check rate limit (5 attempts)
        if (verificationCode.getAttemptCount() >= 5) {
            verificationCode.setBlockedUntil(LocalDateTime.now().plusMinutes(30));
            repo.save(verificationCode);
            throw new IllegalArgumentException("Too many attempts. Please wait 30 minutes.");
        }

        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Update entity
        verificationCode.setOtpCode(otp);
        verificationCode.setExpiredAt(LocalDateTime.now().plusMinutes(5)); // OTP valid for 5 mins
        verificationCode.setAttemptCount(verificationCode.getAttemptCount() + 1);
        verificationCode.setLastGeneratedTime(LocalDateTime.now());
        verificationCode.setBlockedUntil(null); // Clear blocking if any (though logic above handles it)

        repo.save(verificationCode);

        // Send event
        producer.sendMessage(new OtpEvent(email, SUBJECT, TEMPLATE, otp));
        log.info("OTP sent successfully to {}", email);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        log.info("Verifying OTP for email: {}", email);

        var verificationCode = repo.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("OTP not found"));

        if (verificationCode.getExpiredAt() == null
                || verificationCode.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired");
        }

        if (verificationCode.getOtpCode() == null || !verificationCode.getOtpCode().equals(otp)) {
            return false;
        }

        // Do not clear OTP here, as it might be needed for password reset

        return true;
    }

    @Override
    public void verifyAndResetPassword(String email, String otp, String newPassword) {
        if (!verifyOtp(email, otp)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        // At this point, OTP is valid (checked by verifyOtp)
        // Reset password
        uSrv.resetPassword(email, newPassword);

        // Clear OTP after successful reset
        var verificationCode = repo.findByEmail(email).get(); // Safe get because verifyOtp checks existence
        verificationCode.setOtpCode(null);
        verificationCode.setExpiredAt(LocalDateTime.now());
        repo.save(verificationCode);
    }
}
