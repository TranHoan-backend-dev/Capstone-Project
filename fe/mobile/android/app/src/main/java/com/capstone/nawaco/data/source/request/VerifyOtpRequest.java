package com.capstone.nawaco.data.source.request;

public class VerifyOtpRequest {
    private final String email;
    private final String otp;

    public VerifyOtpRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public String getOtp() {
        return otp;
    }
}
