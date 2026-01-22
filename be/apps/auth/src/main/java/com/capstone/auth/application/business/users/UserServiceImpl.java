package com.capstone.auth.application.business.users;

import com.capstone.auth.application.dto.response.CheckExistenceResponse;
import com.capstone.auth.application.exception.ExistingException;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.Users;
import com.capstone.auth.domain.model.enumerate.RoleName;
import com.capstone.auth.domain.repository.RoleRepository;
import com.capstone.auth.domain.repository.UserRepository;
import com.capstone.auth.infrastructure.config.Constant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
  UserRepository repo;
  RoleRepository roleRepo;
  PasswordEncoder encoder;

  @Override
  public void createEmployee(
      String username, String password, String email,
      RoleName roleName, String jobIds, String businessIds,
      String departmentId, String waterSupplyNetworkId) throws ExecutionException, InterruptedException {
    log.info("UsersService is handling the request");
    var obj = repo.findByEmail(email);
    if (obj.isPresent()) {
      throw new ExistingException(Constant.SE_01);
    }

    var role = roleRepo.findRolesByName(roleName.toString());
    log.info("New account's role: {}", role);
    var passwordHash = hashPassword(password).get();
    var user = Users.create(builder -> builder
        .email(email)
        .password(passwordHash)
        .username(username)
        .role(role)
        .waterSupplyNetworkId(waterSupplyNetworkId)
        .departmentId(departmentId));
    log.info("New account's information: {}", user);

    repo.save(user);
  }

  @Async("passwordEncoderExecutor")
  public CompletableFuture<String> hashPassword(String password) {
    return CompletableFuture.completedFuture(encoder.encode(password));
  }

  @Override
  public void updatePassword(String email, @NonNull String password, String newPassword) {
    var obj = getUsersByEmail(email);
    if (password.equals(newPassword)) {
      updateUser(obj, newPassword);
    }
    log.debug("Passwords do not match");
    throw new IllegalArgumentException(Constant.SE_03);
  }

  @Override
  public void resetPassword(String email, String newPassword) {
    var obj = getUsersByEmail(email);
    updateUser(obj, newPassword);
  }

  private @NonNull Users getUsersByEmail(String email) {
    var obj = repo.findByEmail(email);
    if (obj.isEmpty()) {
      throw new NotExistingException(Constant.SE_02);
    }
    log.info("Find user by email: {}", obj);
    return obj.get();
  }

  private void updateUser(@NonNull Users obj, String password) {
    obj.setPassword(encoder.encode(password));
    repo.save(obj);
    log.info("Password reset successfully");
  }

  @Override
  public CheckExistenceResponse checkExistence(String username,
      String email) {
    boolean isUsernameExists = false;
    boolean isEmailExists = false;

    if (username != null && !username.isBlank()) {
      isUsernameExists = repo.existsByUsername(username);
    }

    if (email != null && !email.isBlank()) {
      isEmailExists = repo.existsByEmail(email);
    }

    log.info("Username is {}", isUsernameExists ? "existing" : "not existing");
    log.info("Email is {}", isEmailExists ? "existing" : "not existing");

    return new CheckExistenceResponse(isUsernameExists, isEmailExists);
  }
}
