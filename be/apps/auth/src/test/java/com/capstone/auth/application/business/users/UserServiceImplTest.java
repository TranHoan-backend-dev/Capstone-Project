package com.capstone.auth.application.business.users;

import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.domain.model.Users;
import com.capstone.auth.domain.model.enumerate.RoleName;
import com.capstone.auth.domain.repository.RoleRepository;
import com.capstone.auth.domain.repository.UserRepository;
import com.capstone.auth.infrastructure.config.Constant;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {
  @Mock
  UserRepository userRepository;

  @Mock
  PasswordEncoder passwordEncoder;

  @InjectMocks
  UserServiceImpl userService;

  @Test
  void getUserById_returns_user_dto() {
    var role = Roles.create(builder -> builder.name(RoleName.IT_DEPARTMENT_STAFF));
    var user = Users.create(builder -> builder
        .email("user@example.com")
        .password("hash")
        .username("user1")
        .role(role)
        .jobId("job1")
        .departmentId("dept1")
        .waterSupplyNetworkId("water1")
        .isLocked(false)
        .isEnabled(true));

    when(userRepository.findById("id-1")).thenReturn(Optional.of(user));

    var dto = userService.getUserById("id-1");

    assertEquals("IT_DEPARTMENT_STAFF", dto.role());
    assertEquals("user1", dto.username());
    assertEquals("user@example.com", dto.email());
    assertFalse(dto.isLocked());
    assertTrue(dto.isEnabled());
  }

  @Test
  void getUserById_throws_when_missing() {
    when(userRepository.findById("missing")).thenReturn(Optional.empty());

    NotExistingException ex = assertThrows(
        NotExistingException.class,
        () -> userService.getUserById("missing"));

    assertEquals("User with id does not exist", ex.getMessage());
  }

  @Test
  void updatePassword_updates_when_old_password_matches() {
    var user = Users.create(builder -> builder
        .email("user@example.com")
        .password("hash-old")
        .username("user1")
        .role(Roles.create(b -> b.name(RoleName.IT_DEPARTMENT_STAFF)))
        .jobId("job1")
        .departmentId("dept1")
        .waterSupplyNetworkId("water1")
        .isLocked(false)
        .isEnabled(true));

    when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("oldPass", "hash-old")).thenReturn(true);
    when(passwordEncoder.encode("newPass")).thenReturn("hash-new");

    userService.updatePassword("user@example.com", "oldPass", "newPass");

    ArgumentCaptor<Users> captor = ArgumentCaptor.forClass(Users.class);
    verify(userRepository).save(captor.capture());
    assertEquals("hash-new", captor.getValue().getPassword());
  }

  @Test
  void updatePassword_throws_when_old_password_mismatch() {
    var user = Users.create(builder -> builder
        .email("user@example.com")
        .password("hash-old")
        .username("user1")
        .role(Roles.create(b -> b.name(RoleName.IT_DEPARTMENT_STAFF)))
        .jobId("job1")
        .departmentId("dept1")
        .waterSupplyNetworkId("water1")
        .isLocked(false)
        .isEnabled(true));

    when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("oldPass", "hash-old")).thenReturn(false);

    IllegalArgumentException ex = assertThrows(
        IllegalArgumentException.class,
        () -> userService.updatePassword("user@example.com", "oldPass", "newPass"));

    assertEquals(Constant.SE_03, ex.getMessage());
  }

  @Test
  void checkExistence_uses_email_lookup_when_value_is_email() {
    when(userRepository.existsByEmail("user@example.com")).thenReturn(true);

    boolean exists = userService.checkExistence("user@example.com");

    assertTrue(exists);
  }

  @Test
  void checkExistence_uses_username_lookup_when_value_is_not_email() {
    when(userRepository.existsByUsername("user1")).thenReturn(true);

    boolean exists = userService.checkExistence("user1");

    assertTrue(exists);
  }
}
