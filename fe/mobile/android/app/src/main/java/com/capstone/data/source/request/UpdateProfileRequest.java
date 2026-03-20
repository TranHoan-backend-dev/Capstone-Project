package com.capstone.data.source.request;

import androidx.annotation.Nullable;

public class UpdateProfileRequest {
    private final String fullName;
    private final String username;
    private final String phoneNumber;
    private final String birthdate;
    private final String address;
    private final Boolean gender;

    public UpdateProfileRequest(@Nullable String fullName, @Nullable String username, @Nullable String phoneNumber, 
                                @Nullable String birthdate, @Nullable String address, @Nullable Boolean gender) {
        this.fullName = fullName;
        this.username = username;
        this.phoneNumber = phoneNumber;
        this.birthdate = birthdate;
        this.address = address;
        this.gender = gender;
    }

    @Nullable public String getFullName() { return fullName; }
    @Nullable public String getUsername() { return username; }
    @Nullable public String getPhoneNumber() { return phoneNumber; }
    @Nullable public String getBirthdate() { return birthdate; }
    @Nullable public String getAddress() { return address; }
    @Nullable public Boolean getGender() { return gender; }
}
