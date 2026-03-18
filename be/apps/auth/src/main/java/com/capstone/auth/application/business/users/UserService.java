package com.capstone.auth.application.business.users;

import com.capstone.auth.application.business.dto.UserDTO;
import com.capstone.auth.application.dto.request.users.FilterUsersRequest;
import com.capstone.auth.application.dto.request.users.UpdateRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.auth.domain.model.Roles;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface UserService {
  void createEmployee(String userId, String username, String email,
                      Roles role, List<String> jobIds, String departmentId,
                      String waterSupplyNetworkId, String fullName, String phone) throws ExecutionException, InterruptedException;

  boolean checkExistence(String value);

  boolean isUserExists(String id);

  UserDTO getUserById(String id);

  UserDTO updateUsername(String id, String username);

  UserDTO getUserByEmail(String email);

  Page<EmployeeResponse> getAllEmployeesWithStatus(Pageable pageable, FilterUsersRequest request);

  boolean isJobAssigned(String jobId);

  EmployeeResponse updateEmployee(String id, UpdateRequest request);

  EmployeeResponse deleteEmployee(String id);

  String getRoleOfEmployee(String id);

  List<EmployeeResponse> getAllSurveyStaffs();
}
