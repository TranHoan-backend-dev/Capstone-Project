package com.capstone.auth.service.boundary;

import com.capstone.auth.model.enumerate.RoleName;

public interface UsersService {
  void createEmployee(String fullName, String username, String password, String email, RoleName roleName);

  void updatePassword(String email, String password, String newPassword);

  void resetPassword(String email, String newPassword);
}
