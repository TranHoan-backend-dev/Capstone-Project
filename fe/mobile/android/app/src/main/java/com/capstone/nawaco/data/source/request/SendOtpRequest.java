package com.capstone.nawaco.data.source.request;

public class SendOtpRequest {
    private final String email;

    public SendOtpRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
