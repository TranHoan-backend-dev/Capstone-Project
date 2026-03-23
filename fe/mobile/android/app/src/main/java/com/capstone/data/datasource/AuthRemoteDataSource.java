package com.capstone.data.datasource;

import com.capstone.data.source.remote.AuthApi;
import com.capstone.data.source.request.ChangePasswordRequest;
import com.capstone.data.source.request.UpdateProfileRequest;
import com.capstone.data.source.request.ResetPasswordRequest;
import com.capstone.data.source.request.SendOtpRequest;
import com.capstone.data.source.request.VerifyOtpRequest;
import com.capstone.data.source.response.UserProfileResponse;
import com.capstone.data.source.response.WrapperApiResponse;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.Response;

import java.io.IOException;

public class AuthRemoteDataSource {
    private final AuthApi api;

    public AuthRemoteDataSource(AuthApi api) {
        this.api = api;
    }

    public UserProfileResponse login(String accessToken) throws Exception {
        Response<WrapperApiResponse<UserProfileResponse>> response = api.login("Bearer " + accessToken).execute();
        if (response.isSuccessful() && response.body() != null) {
            return response.body().getData();
        }
        throw new Exception("Login failed: " + response.message());
    }

    public String sendOtp(String email) throws Exception {
        Response<WrapperApiResponse<Void>> response = api.sendOtp(new SendOtpRequest(email)).execute();
        if (response.isSuccessful() && response.body() != null) {
            return response.body().getMessage();
        }
        throw new Exception("Send OTP failed: " + response.message());
    }

    public String verifyOtp(String email, String otp) throws Exception {
        Response<WrapperApiResponse<Void>> response = api.verifyOtp(new VerifyOtpRequest(email, otp)).execute();
        if (response.isSuccessful() && response.body() != null) {
            return response.body().getMessage();
        }
        throw new Exception("Verify OTP failed: " + response.message());
    }

    public String resetPassword(ResetPasswordRequest request) throws Exception {
        Response<WrapperApiResponse<Void>> response = api.resetPassword(request).execute();
        if (response.isSuccessful() && response.body() != null) {
            return response.body().getMessage();
        }
        throw new Exception("Reset password failed: " + response.message());
    }

    public String changePassword(ChangePasswordRequest request) throws Exception {
        Response<WrapperApiResponse<Void>> response = api.changePassword(request).execute();
        if (response.isSuccessful() && response.body() != null) {
            return response.body().getMessage();
        }
        throw new Exception("Change password failed: " + response.message());
    }

    public UserProfileResponse updateProfile(UpdateProfileRequest request) throws Exception {
        Response<WrapperApiResponse<UserProfileResponse>> response = api.updateProfile(request).execute();
        if (response.isSuccessful() && response.body() != null) {
            return response.body().getData();
        }
        throw new Exception("Update profile failed: " + response.message());
    }

    public UserProfileResponse updateAvatar(byte[] imageBytes) throws Exception {
        RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), imageBytes);
        MultipartBody.Part body = MultipartBody.Part.createFormData("avatar", "avatar.jpg", requestFile);
        Response<WrapperApiResponse<UserProfileResponse>> response = api.updateAvatar(body).execute();
        if (response.isSuccessful() && response.body() != null) {
            return response.body().getData();
        }
        throw new Exception("Update avatar failed: " + response.message());
    }

    public UserProfileResponse getMe() throws Exception {
        Response<WrapperApiResponse<UserProfileResponse>> response = api.getMe().execute();
        if (response.isSuccessful() && response.body() != null) {
            return response.body().getData();
        }
        throw new Exception("Get me failed: " + response.message());
    }
}
