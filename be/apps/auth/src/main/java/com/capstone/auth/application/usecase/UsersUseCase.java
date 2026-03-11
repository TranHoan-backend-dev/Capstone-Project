package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.pages.BusinessPageService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.FilterUsersRequest;
import com.capstone.auth.application.dto.request.UpdateBusinessPageNamesRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UsersUseCase {
  UserService userService;
  BusinessPageService bpService;

  public Page<EmployeeResponse> getPaginatedListOfEmployees(Pageable pageable, FilterUsersRequest request) {
    return userService.getAllEmployeesWithStatus(pageable, request);
  }

  public Object getListOfPagesByEmployeeId(String id) {
    return bpService.getPagesByEmployeeId(id);
  }

  public void updateBusinessPagesListOfEmployee(@NonNull List<UpdateBusinessPageNamesRequest> request) {
    request.forEach(r -> bpService.updatePagesOfEmployee(r.empId(), r.pages()));
  }

  public boolean checkIfEmployeeExists(String id) {
    return userService.isUserExists(id);
  }

  public boolean isJobAssigned(String jobId) {
    return userService.isJobAssigned(jobId);
  }
}
