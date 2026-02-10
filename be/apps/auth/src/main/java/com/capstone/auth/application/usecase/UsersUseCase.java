package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.pages.BusinessPageService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.FilterUsersRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UsersUseCase {
  UserService userService;
  BusinessPageService bpService;

  public Page<EmployeeResponse> getPaginatedListOfEmployees(Pageable pageable, FilterUsersRequest request) {
    log.info("getPaginatedListOfEmployees is handling the request");

    var content = userService.getAllEmployeesWithStatus(pageable, request);
    log.info("Found {} employees", content.getNumberOfElements());
    return content;
  }

  public Object getListOfPagesByEmployeeId(String id) {
    log.info("getListOfPagesByEmployeeId is handling the request");
    return bpService.getPagesByEmployeeId(id);
  }
}
