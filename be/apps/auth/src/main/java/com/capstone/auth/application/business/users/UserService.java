package com.capstone.auth.application.business.users;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.domain.model.Roles;

import java.util.concurrent.ExecutionException;

public interface UserService {
  void createEmployee(String username, String password, String email,
      Roles role, String jobIds, String businessIds,
      String departmentId, String waterSupplyNetworkId) throws ExecutionException, InterruptedException;

  void updatePassword(String email, String password, String newPassword);

  void resetPassword(String email, String newPassword);

  boolean checkExistence(String value);

  boolean isUserExists(String id);

  UserDTO getUserById(String id);
}
