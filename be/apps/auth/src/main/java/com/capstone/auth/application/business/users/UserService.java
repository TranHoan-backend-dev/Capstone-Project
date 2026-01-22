package com.capstone.auth.application.business.users;

import com.capstone.auth.application.dto.response.CheckExistenceResponse;
import com.capstone.auth.domain.model.enumerate.RoleName;

import java.util.concurrent.ExecutionException;

public interface UserService {
  void createEmployee(String username, String password, String email,
      RoleName roleName, String jobIds, String businessIds,
      String departmentId, String waterSupplyNetworkId) throws ExecutionException, InterruptedException;

  void updatePassword(String email, String password, String newPassword);

  void resetPassword(String email, String newPassword);

  CheckExistenceResponse checkExistence(String username, String email);
}
