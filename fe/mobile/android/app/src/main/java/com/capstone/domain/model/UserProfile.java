package com.capstone.domain.model;

import androidx.annotation.Nullable;
import com.capstone.data.source.response.UserProfileResponse;

public class UserProfile {
    private final String fullName;
    private final String avatarUrl;
    private final String address;
    private final String phoneNumber;
    private final String gender;
    private final String birthday;
    private final String role;
    private final String username;
    private final String email;

    public UserProfile(String fullName, String avatarUrl, String address, String phoneNumber, 
                       String gender, String birthday, String role, String username, String email) {
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.birthday = birthday;
        this.role = role;
        this.username = username;
        this.email = email;
    }

    public String getFullName() { return fullName; }
    @Nullable public String getAvatarUrl() { return avatarUrl; }
    @Nullable public String getAddress() { return address; }
    @Nullable public String getPhoneNumber() { return phoneNumber; }
    @Nullable public String getGender() { return gender; }
    @Nullable public String getBirthday() { return birthday; }
    public String getRole() { return role; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }

    public static UserProfile fromResponse(UserProfileResponse response) {
        return new UserProfile(
            response.getFullName(),
            response.getAvatarUrl(),
            response.getAddress(),
            response.getPhoneNumber(),
            response.getGender(),
            response.getBirthday(),
            response.getRole(),
            response.getUsername(),
            response.getEmail()
        );
    }
}
