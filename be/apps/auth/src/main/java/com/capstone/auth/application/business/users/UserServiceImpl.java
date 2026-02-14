package com.capstone.auth.application.business.users;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.dto.request.FilterUsersRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.auth.application.exception.ExistingException;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.domain.model.Users;
import com.capstone.auth.infrastructure.persistence.UserRepository;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.IdEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.concurrent.CompletableFuture;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
  UserRepository repo;
  PasswordEncoder encoder;
  @NonFinal
  Logger log;

  @Override
  public void createEmployee(
    String username, String email,
    Roles role, String jobIds, String businessIds,
    String departmentId, String waterSupplyNetworkId) {
    log.info("UsersService is handling the request");
    var obj = repo.findByEmail(email);
    if (obj.isPresent()) {
      throw new ExistingException(Constant.SE_01);
    }

    var user = Users.create(builder -> builder
      .email(email)
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
//    if (encoder.matches(password, obj.getPassword())) {
//      updateUser(obj, newPassword);
//      return;
//    }
    log.debug("Old passwords do not match");
    throw new IllegalArgumentException(Constant.SE_03);
  }

  @Override
  public void resetPassword(String email, String newPassword) {
    var obj = getUsersByEmail(email);
    updateUser(obj, newPassword);
  }

  @Override
  public boolean checkExistence(String value) {
    Objects.requireNonNull(value, "Value cannot be null");
    var isCredentialsExists = false;

    if (!value.isBlank()) {
      if (value.matches(Constant.EMAIL_PATTERN)) {
        isCredentialsExists = repo.existsByEmail(value);
      } else {
        isCredentialsExists = repo.existsByUsername(value);
      }
    }

    log.info("Credentials is {}", isCredentialsExists ? "existing" : "not existing");

    return isCredentialsExists;
  }

  @Override
  public boolean isUserExists(String id) {
    log.info("Checking existence of user with id: {}", id);
    Objects.requireNonNull(id, "id cannot be null");
    return repo.existsById(id);
  }

  @Override
  public UserDTO getUserById(String id) {
    log.info("Getting user by id: {}", id);
    var user = repo
      .findById(id)
      .orElseThrow(() -> new NotExistingException("User with id does not exist"));
    log.info("User found: {}", user);
    return returnUserDTO(user);
  }

  @Override
  public UserDTO updateUsername(String id, String username) {
    log.info("Saving user: {}", username);
    var currentUser = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

    currentUser.setUsername(username);
    repo.save(currentUser);
    return returnUserDTO(currentUser);
  }

  @Override
  public Page<EmployeeResponse> getAllEmployeesWithStatus(Pageable pageable, FilterUsersRequest request) {
    log.info("Getting all active employees with activate status: {}", request);

    var usersList = request.isEnabled() == null ? repo.findAll(pageable) : repo.findByIsEnabledTrueAndIsLockedFalse(pageable);
    var content = usersList.getContent().stream().map(c -> new EmployeeResponse(
      IdEncoder.encode(c.getUserId()),
      c.getUsername(),
      c.getEmail())
    ).toList();

    if (request.username() != null) {
      content = content.stream()
        .filter(c -> c
          .username().toLowerCase()
          .contains(request.username().toLowerCase())
        )
        .toList();
    }
    log.info("Found {} employees", content.size());

    return new PageImpl<>(
      content,
      pageable,
      content.size()
    );
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
//    obj.setPassword(encoder.encode(password));
//    repo.save(obj);
//    log.info("Password reset successfully");
  }

  private UserDTO returnUserDTO(@NonNull Users currentUser) {
    return new UserDTO(
      currentUser.getUserId(),
      currentUser.getRole().getName().name(),
      currentUser.getUsername(),
      currentUser.getEmail(),
      currentUser.getIsLocked(),
      currentUser.getCreatedAt(),
      currentUser.getUpdatedAt(),
      currentUser.getLockedReason(),
      currentUser.getLockedAt(),
      currentUser.getJobId(),
      currentUser.getDepartmentId(),
      currentUser.getWaterSupplyNetworkId(),
      currentUser.getElectronicSigningUrl(),
      currentUser.getIsEnabled());
  }
}
