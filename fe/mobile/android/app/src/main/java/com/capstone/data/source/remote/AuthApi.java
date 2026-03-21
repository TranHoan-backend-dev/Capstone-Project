package com.capstone.data.source.remote;

import com.capstone.data.source.request.ChangePasswordRequest;
import com.capstone.data.source.request.UpdateProfileRequest;
import com.capstone.data.source.request.ResetPasswordRequest;
import com.capstone.data.source.request.SendOtpRequest;
import com.capstone.data.source.request.VerifyOtpRequest;
import com.capstone.data.source.response.UserProfileResponse;
import com.capstone.data.source.response.WrapperApiResponse;

import okhttp3.MultipartBody;
import retrofit2.Call;
import retrofit2.http.*;

public interface AuthApi {
    @Headers("No-Authentication: true")
    @POST("/auth/login")
    Call<WrapperApiResponse<UserProfileResponse>> login(@Header("Authorization") String bearer);

    @Headers("No-Authentication: true")
    @POST("/auth/send-otp")
    Call<WrapperApiResponse<Void>> sendOtp(@Body SendOtpRequest request);

    @Headers("No-Authentication: true")
    @POST("/auth/verify-otp")
    Call<WrapperApiResponse<Void>> verifyOtp(@Body VerifyOtpRequest request);

    @Headers("No-Authentication: true")
    @POST("/auth/reset-password")
    Call<WrapperApiResponse<Void>> resetPassword(@Body ResetPasswordRequest request);

    @POST("/auth/change-password")
    Call<WrapperApiResponse<Void>> changePassword(@Body ChangePasswordRequest request);

    @PATCH("/me")
    Call<WrapperApiResponse<UserProfileResponse>> updateProfile(@Body UpdateProfileRequest request);

    @Multipart
    @PATCH("/me")
    Call<WrapperApiResponse<UserProfileResponse>> updateAvatar(@Part MultipartBody.Part avatar);

    @GET("/auth/me")
    Call<WrapperApiResponse<UserProfileResponse>> getMe();
}
