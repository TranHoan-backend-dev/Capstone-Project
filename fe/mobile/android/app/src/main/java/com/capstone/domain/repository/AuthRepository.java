package com.capstone.domain.repository;

import com.capstone.domain.model.UserProfile;

import androidx.annotation.Nullable;

public interface AuthRepository {
    UserProfile login(String accessToken) throws Exception;

    String sendOtp(String email) throws Exception;

    String verifyOtp(String email, String otp) throws Exception;

    String resetPassword(String email, String otp, String newPassword) throws Exception;

    String changePassword(String oldPass, String newPass, String confirmPass) throws Exception;

    UserProfile updateProfile(
            @Nullable String fullName,
            @Nullable String username,
            @Nullable String phoneNumber,
            @Nullable String birthdate,
            @Nullable String address,
            @Nullable Boolean gender
    ) throws Exception;

    UserProfile updateAvatar(byte[] imageBytes) throws Exception;

    UserProfile getMe() throws Exception;
}
