package com.capstone.auth.application.business.users;

import com.capstone.auth.domain.model.enumerate.RoleName;

import java.util.concurrent.ExecutionException;

public interface UserService {
  void createEmployee(String username, String password, String email, RoleName roleName) throws ExecutionException, InterruptedException;

  void updatePassword(String email, String password, String newPassword);

  void resetPassword(String email, String newPassword);
}
