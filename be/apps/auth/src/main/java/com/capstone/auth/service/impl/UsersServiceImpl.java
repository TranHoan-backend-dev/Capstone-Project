package com.capstone.auth.service.impl;

import com.capstone.auth.exception.ExistingException;
import com.capstone.auth.exception.NotExistingException;
import com.capstone.auth.model.Roles;
import com.capstone.auth.model.Users;
import com.capstone.auth.model.enumerate.RoleName;
import com.capstone.auth.repository.RoleRepository;
import com.capstone.auth.repository.UserRepository;
import com.capstone.auth.service.boundary.UsersService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
  ) {
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

  private Users buildUsers(String fullName, String username, String password, String email, Roles role) {
    return Users.builder()
      .username(username)
      .password(encoder.encode(password))
      .fullName(fullName)
      .email(email)
      .createdAt(LocalDateTime.now())
      .updatedAt(LocalDateTime.now())
      .role(role)
      .build();
  }

}
