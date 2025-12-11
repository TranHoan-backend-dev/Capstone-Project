package com.capstone.auth.application.business.users;

import com.capstone.auth.application.exception.ExistingException;
import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.domain.model.Users;
import com.capstone.auth.domain.model.enumerate.RoleName;
import com.capstone.auth.domain.repository.RoleRepository;
import com.capstone.auth.domain.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UsersServiceImpl implements UsersService {
  UserRepository repo;
  RoleRepository roleRepo;
  PasswordEncoder encoder;

  @Override
  public void createEmployee(
    String fullName, String username, String password,
    String email, RoleName roleName
  ) throws ExecutionException, InterruptedException {
    log.info("UsersService is handling the request");
    var obj = repo.findByEmail(email);
    if (obj.isPresent()) {
      throw new ExistingException("Email found");
    }

    var role = roleRepo.findRolesByName(roleName.toString());
    log.info("New account's role: {}", role);
    var user = buildUsers(fullName, username, password, email, role);
    log.info("New account's information: {}", user);

    repo.save(user);
  }

  @Async("passwordEncoderExecutor")
  public CompletableFuture<String> hashPassword(String password) {
    return CompletableFuture.completedFuture(encoder.encode(password));
  }

  @Override
  public void updatePassword(String email, String password, String newPassword) {
    var obj = repo.findByEmail(email);
    if (obj.isEmpty()) {
      throw new NotExistingException("Email not found");
    }
    // TODO: handle this shit
  }

  @Override
  public void resetPassword(String email, String newPassword) {

  }

  private Users buildUsers(
    String fullName, String username, String password,
    String email, Roles role
  ) throws ExecutionException, InterruptedException {
    return Users.builder()
      .username(username)
      .password(hashPassword(password).get())
      .fullName(fullName)
      .email(email)
      .createdAt(LocalDateTime.now())
      .updatedAt(LocalDateTime.now())
      .role(role)
      .build();
  }

}
