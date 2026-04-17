package com.capstone.infrastructure.security;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKey;

import dagger.hilt.android.qualifiers.ApplicationContext;

import javax.inject.Inject;
import javax.inject.Singleton;

import java.io.IOException;
import java.security.GeneralSecurityException;

@Singleton
public class TokenManager {
    private static final String ACCESS_TOKEN = "access_token";
    private static final String REFRESH_TOKEN = "refresh_token";
    private static final String USER_ROLE = "user_role";

    private SharedPreferences sharedPrefs;

    @Inject
    public TokenManager(@ApplicationContext Context context) {
        try {
            var masterKey = new MasterKey.Builder(context)
                    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                    .build();

            sharedPrefs = EncryptedSharedPreferences.create(
                    context,
                    "secure_prefs",
                    masterKey,
                    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            );
        } catch (GeneralSecurityException | IOException e) {
            e.printStackTrace();
            // Fallback or error handling
        }
    }

    public void saveSession(String accessToken, String refreshToken, String role) {
        SharedPreferences.Editor editor = sharedPrefs.edit();
        editor.putString(ACCESS_TOKEN, accessToken);
        if (refreshToken != null) editor.putString(REFRESH_TOKEN, refreshToken);
        if (role != null) editor.putString(USER_ROLE, role);
        editor.apply();
    }

    public String getUserRole() {
        return sharedPrefs.getString(USER_ROLE, null);
    }

    public String getAccessToken() {
        return sharedPrefs.getString(ACCESS_TOKEN, null);
    }

    public String getRefreshToken() {
        return sharedPrefs.getString(REFRESH_TOKEN, null);
    }

    public void clearTokens() {
        sharedPrefs.edit().clear().apply();
    }

    public boolean hasToken() {
        return getAccessToken() != null;
    }
}
