package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.dto.ProfileDTO;
import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.business.profile.ProfileService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.infrastructure.config.Constant;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.DisabledException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProfileUseCaseGetMeTest {

    @Mock
    UserService userService;

    @Mock
    ProfileService profileService;

    @InjectMocks
    ProfileUseCase profileUseCase;

    @Test
    void getMe_returns_profile_response_when_successful() {
        var id = "user-1";
        var email = "user@example.com";
        var username = "user1";

        var userDTO = new UserDTO("IT_DEPARTMENT_STAFF", username, email, false, true);
        var profileDTO = new ProfileDTO(
                id, "Full Name", "avatar.png", "Address", "0912345678", "true", "1990-01-01");

        when(userService.getUserById(id)).thenReturn(userDTO);
        when(profileService.getProfileById(id)).thenReturn(profileDTO);

        var response = profileUseCase.getMe(id, email, username);

        assertNotNull(response);
        assertEquals("Full Name", response.fullname());
        assertEquals(username, response.username());
        assertEquals(email, response.email());
        assertEquals("it_department_staff", response.role());
    }

    @Test
    void getMe_throws_disabled_exception_when_account_locked() {
        var id = "user-1";
        var userDTO = new UserDTO("STAFF", "user1", "user@example.com", true, true);

        when(userService.getUserById(id)).thenReturn(userDTO);

        DisabledException ex = assertThrows(DisabledException.class,
                () -> profileUseCase.getMe(id, "user@example.com", "user1"));
        assertEquals(Constant.SE_07, ex.getMessage());
    }

    @Test
    void getMe_throws_exception_when_email_mismatch() {
        var id = "user-1";
        var userDTO = new UserDTO("STAFF", "user1", "user@example.com", false, true);

        when(userService.getUserById(id)).thenReturn(userDTO);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> profileUseCase.getMe(id, "wrong@example.com", "user1"));
        assertEquals("Email does not match", ex.getMessage());
    }

    @Test
    void getMe_throws_exception_when_username_mismatch() {
        var id = "user-1";
        var userDTO = new UserDTO("STAFF", "user1", "user@example.com", false, true);

        when(userService.getUserById(id)).thenReturn(userDTO);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> profileUseCase.getMe(id, "user@example.com", "wronguser"));
        assertEquals("Username does not match", ex.getMessage());
    }

    @Test
    void getMe_throws_not_existing_exception_when_user_not_found() {
        var id = "missing-user";
        var email = "user@example.com";
        var username = "user1";
        when(userService.getUserById(id))
                .thenThrow(new NotExistingException("User not found"));

        assertThrows(NotExistingException.class,
                () -> profileUseCase.getMe(id, email, username));
    }

    @Test
    void getMe_throws_exception_when_email_null() {
        var id = "user-1";
        var userDTO = new UserDTO("STAFF", "user1", "user@example.com", false, true);
        when(userService.getUserById(id)).thenReturn(userDTO);

        var ex = assertThrows(IllegalArgumentException.class, () -> profileUseCase.getMe(id, null, "user1"));
        assertEquals(Constant.PT_01, ex.getMessage());
    }

    @Test
    void getMe_throws_exception_when_email_invalid_format() {
        var id = "user-1";
        var userDTO = new UserDTO("STAFF", "user1", "user@example.com", false, true);
        when(userService.getUserById(id)).thenReturn(userDTO);

        var ex = assertThrows(IllegalArgumentException.class, () -> profileUseCase.getMe(id, "invalid-email", "user1"));
        assertEquals(Constant.PT_01, ex.getMessage());
    }

    @Test
    void getMe_throws_exception_when_username_null() {
        var id = "user-1";
        var userDTO = new UserDTO("STAFF", "user1", "user@example.com", false, true);
        when(userService.getUserById(id)).thenReturn(userDTO);

        var ex = assertThrows(IllegalArgumentException.class, () -> profileUseCase.getMe(id, "user@example.com", null));
        assertEquals(Constant.PT_05, ex.getMessage());
    }

    @Test
    void getMe_throws_not_existing_exception_when_profile_not_found() {
        var id = "user-1";
        var userDTO = new UserDTO("STAFF", "user1", "user@example.com", false, true);
        when(userService.getUserById(id)).thenReturn(userDTO);
        when(profileService.getProfileById(id))
                .thenThrow(new NotExistingException("Profile not found"));

        assertThrows(NotExistingException.class,
                () -> profileUseCase.getMe(id, "user@example.com", "user1"));
    }
}
