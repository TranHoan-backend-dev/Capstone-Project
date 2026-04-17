package com.capstone.nawaco.ui.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.capstone.nawaco.common.utils.Result;
import com.capstone.nawaco.domain.model.UserProfile;
import com.capstone.nawaco.domain.usecase.*;
import com.capstone.nawaco.infrastructure.security.AntiBruteForceManager;

import dagger.hilt.android.lifecycle.HiltViewModel;

import javax.inject.Inject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * ViewModel quản lý logic nghiệp vụ và trạng thái giao diện cho toàn bộ quy trình Auth.
 * Sử dụng LiveData để thông báo trạng thái thay đổi cho UI (Activity/Fragment).
 */
@HiltViewModel
public class AuthViewModel extends ViewModel {

    private final LoginUseCase loginUseCase;
    private final ForgotPasswordUseCase forgotPasswordUseCase;
    private final ChangePasswordUseCase changePasswordUseCase;
    private final GetProfileUseCase getProfileUseCase;
    private final UpdateProfileUseCase updateProfileUseCase;
    private final AntiBruteForceManager bruteForceManager;

    private final MutableLiveData<AuthState> authState = new MutableLiveData<>(new AuthState.Idle());
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @Inject
    public AuthViewModel(
            LoginUseCase loginUseCase,
            ForgotPasswordUseCase forgotPasswordUseCase,
            ChangePasswordUseCase changePasswordUseCase,
            GetProfileUseCase getProfileUseCase,
            UpdateProfileUseCase updateProfileUseCase,
            AntiBruteForceManager bruteForceManager
    ) {
        this.loginUseCase = loginUseCase;
        this.forgotPasswordUseCase = forgotPasswordUseCase;
        this.changePasswordUseCase = changePasswordUseCase;
        this.getProfileUseCase = getProfileUseCase;
        this.updateProfileUseCase = updateProfileUseCase;
        this.bruteForceManager = bruteForceManager;
    }

    public LiveData<AuthState> getAuthState() {
        return authState;
    }

    public LiveData<UserProfile> getUserProfile() {
        MutableLiveData<UserProfile> profile = new MutableLiveData<>();
        if (authState.getValue() instanceof AuthState.AuthSuccess) {
            profile.setValue(((AuthState.AuthSuccess) authState.getValue()).getProfile());
        }
        return profile;
    }

    public void login(String accessToken) {
        authState.setValue(new AuthState.Loading());
        executor.execute(() -> {
            Result<UserProfile> result = loginUseCase.execute(accessToken);
            if (result.isSuccess()) {
                authState.postValue(new AuthState.AuthSuccess(result.getOrNull()));
            } else {
                authState.postValue(new AuthState.Error(result.exceptionOrNull().getMessage()));
            }
        });
    }

    public void sendOtp(String email) {
        authState.setValue(new AuthState.Loading());
        executor.execute(() -> {
            Result<String> result = forgotPasswordUseCase.sendOtp(email);
            if (result.isSuccess()) {
                authState.postValue(new AuthState.MessageSent(result.getOrNull()));
            } else {
                authState.postValue(new AuthState.Error(result.exceptionOrNull().getMessage()));
            }
        });
    }

    public void verifyOtp(String email, String otp) {
        if (bruteForceManager.isLocked(email)) {
            authState.setValue(new AuthState.Error("Tài khoản bị tạm khóa do nhập sai quá nhiều lần. Vui lòng thử lại sau."));
            return;
        }

        authState.setValue(new AuthState.Loading());
        executor.execute(() -> {
            Result<String> result = forgotPasswordUseCase.verifyOtp(email, otp);
            if (result.isSuccess()) {
                bruteForceManager.resetAttempts(email);
                authState.postValue(new AuthState.MessageSent(result.getOrNull()));
            } else {
                bruteForceManager.recordFailure(email);
                int remaining = bruteForceManager.getRemainingAttempts(email);
                authState.postValue(new AuthState.Error("Mã OTP không chính xác. Bạn còn " + remaining + " lần thử."));
            }
        });
    }

    public void resetPassword(String email, String otp, String newPass) {
        if (bruteForceManager.isLocked(email)) {
            authState.setValue(new AuthState.Error("Tài khoản đang bị khóa."));
            return;
        }

        authState.setValue(new AuthState.Loading());
        executor.execute(() -> {
            Result<String> result = forgotPasswordUseCase.resetPassword(email, otp, newPass);
            if (result.isSuccess()) {
                bruteForceManager.resetAttempts(email);
                authState.postValue(new AuthState.MessageSent(result.getOrNull()));
            } else {
                bruteForceManager.recordFailure(email);
                authState.postValue(new AuthState.Error(result.exceptionOrNull().getMessage()));
            }
        });
    }

    public void changePassword(String oldPass, String newPass, String confirmPass) {
        authState.setValue(new AuthState.Loading());
        executor.execute(() -> {
            Result<String> result = changePasswordUseCase.execute(oldPass, newPass, confirmPass);
            if (result.isSuccess()) {
                authState.postValue(new AuthState.MessageSent(result.getOrNull()));
            } else {
                authState.postValue(new AuthState.Error(result.exceptionOrNull().getMessage()));
            }
        });
    }

    public void fetchMe() {
        authState.setValue(new AuthState.Loading());
        executor.execute(() -> {
            Result<UserProfile> result = getProfileUseCase.execute();
            if (result.isSuccess()) {
                authState.postValue(new AuthState.AuthSuccess(result.getOrNull()));
            } else {
                authState.postValue(new AuthState.Error(result.exceptionOrNull().getMessage()));
            }
        });
    }

    public void updateProfile(String fullName, String username, String phoneNumber,
                              String birthdate, String address, Boolean gender) {
        authState.setValue(new AuthState.Loading());
        executor.execute(() -> {
            Result<UserProfile> result = updateProfileUseCase.updateInfo(fullName, username, phoneNumber, birthdate, address, gender);
            if (result.isSuccess()) {
                authState.postValue(new AuthState.AuthSuccess(result.getOrNull()));
            } else {
                authState.postValue(new AuthState.Error(result.exceptionOrNull().getMessage()));
            }
        });
    }

    public void updateAvatar(byte[] imageBytes) {
        authState.setValue(new AuthState.Loading());
        executor.execute(() -> {
            Result<UserProfile> result = updateProfileUseCase.updateAvatar(imageBytes);
            if (result.isSuccess()) {
                authState.postValue(new AuthState.AuthSuccess(result.getOrNull()));
            } else {
                authState.postValue(new AuthState.Error(result.exceptionOrNull().getMessage()));
            }
        });
    }

    public void resetState() {
        authState.setValue(new AuthState.Idle());
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        executor.shutdown();
    }

    /**
     * Định nghĩa các trạng thái của luồng Auth.
     */
    public abstract static class AuthState {
        public static final class Idle extends AuthState {
        }

        public static final class Loading extends AuthState {
        }

        public static final class AuthSuccess extends AuthState {
            private final UserProfile profile;

            public AuthSuccess(UserProfile profile) {
                this.profile = profile;
            }

            public UserProfile getProfile() {
                return profile;
            }
        }

        public static final class MessageSent extends AuthState {
            private final String message;

            public MessageSent(String message) {
                this.message = message;
            }

            public String getMessage() {
                return message;
            }
        }

        public static final class Error extends AuthState {
            private final String message;

            public Error(String message) {
                this.message = message;
            }

            public String getMessage() {
                return message;
            }
        }
    }
}
