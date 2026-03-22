package com.capstone.data.repository;

import com.capstone.data.datasource.AuthRemoteDataSource;
import com.capstone.data.source.request.ChangePasswordRequest;
import com.capstone.data.source.request.ResetPasswordRequest;
import com.capstone.data.source.request.UpdateProfileRequest;
import com.capstone.domain.model.UserProfile;
import com.capstone.domain.repository.AuthRepository;
import com.capstone.infrastructure.security.AntiBruteForceManager;
import com.capstone.infrastructure.security.TokenManager;

import androidx.annotation.Nullable;

public class AuthRepositoryImpl implements AuthRepository {
    private final AuthRemoteDataSource remote;
    private final TokenManager tokenManager;
    private final AntiBruteForceManager bruteForceManager;

    public AuthRepositoryImpl(AuthRemoteDataSource remote, TokenManager tokenManager, AntiBruteForceManager bruteForceManager) {
        this.remote = remote;
        this.tokenManager = tokenManager;
        this.bruteForceManager = bruteForceManager;
    }

    @Override
    public UserProfile login(String accessToken) throws Exception {
        var profileResponse = remote.login(accessToken);
        tokenManager.saveSession(accessToken, "SIMULATED_REFRESH_TOKEN", profileResponse.getRole());
        return UserProfile.fromResponse(profileResponse);
    }

    @Override
    public String sendOtp(String email) throws Exception {
        return remote.sendOtp(email);
    }

    @Override
    public String verifyOtp(String email, String otp) throws Exception {
        if (bruteForceManager.isLocked(email)) {
            throw new Exception("Tài khoản bị tạm khóa do thử sai quá nhiều lần. Vui lòng quay lại sau.");
        }
        try {
            var result = remote.verifyOtp(email, otp);
            bruteForceManager.resetAttempts(email);
            return result;
        } catch (Exception e) {
            bruteForceManager.recordFailure(email);
            throw e;
        }
    }

    @Override
    public String resetPassword(String email, String otp, String newPassword) throws Exception {
        if (bruteForceManager.isLocked(email)) {
            throw new Exception("Tài khoản đang bị khóa.");
        }
        try {
            var result = remote.resetPassword(new ResetPasswordRequest(email, otp, newPassword));
            bruteForceManager.resetAttempts(email);
            return result;
        } catch (Exception e) {
            bruteForceManager.recordFailure(email);
            throw e;
        }
    }

    @Override
    public String changePassword(String oldPass, String newPass, String confirmPass) throws Exception {
        return remote.changePassword(new ChangePasswordRequest(oldPass, newPass, confirmPass));
    }

    @Override
    public UserProfile updateProfile(@Nullable String fullName, @Nullable String username, @Nullable String phoneNumber,
                                     @Nullable String birthdate, @Nullable String address, @Nullable Boolean gender) throws Exception {
        var profileResponse = remote.updateProfile(
                new UpdateProfileRequest(fullName, username, phoneNumber, birthdate, address, gender)
        );
        return UserProfile.fromResponse(profileResponse);
    }

    @Override
    public UserProfile updateAvatar(byte[] imageBytes) throws Exception {
        var profileResponse = remote.updateAvatar(imageBytes);
        return UserProfile.fromResponse(profileResponse);
    }

    @Override
    public UserProfile getMe() throws Exception {
        var profileResponse = remote.getMe();
        return UserProfile.fromResponse(profileResponse);
    }
}
