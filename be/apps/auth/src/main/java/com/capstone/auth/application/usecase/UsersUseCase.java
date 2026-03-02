package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.pages.BusinessPageService;
import com.capstone.auth.application.business.roles.RoleService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.FilterUsersRequest;
import com.capstone.auth.application.dto.request.UpdateBusinessPageNamesRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.auth.infrastructure.service.KeycloakService;
import com.capstone.common.annotation.AppLog;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.keycloak.admin.client.Keycloak;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UsersUseCase {
  UserService userService;
  BusinessPageService bpService;
  RoleService roleService;
  Keycloak keycloak;
  KeycloakService keycloakService;
  @NonFinal
  Logger log;

  @Value("${keycloak.realms}")
  @NonFinal
  String realm;

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

  public void updateBusinessPagesListOfEmployees(@NonNull List<UpdateBusinessPageNamesRequest> request) {
    log.info("updateBusinessPagesListOfEmployees is handling the request");
    request.forEach(r -> bpService.updatePagesOfEmployee(r.empId(), r.pages()));
  }

  public boolean checkIfEmployeeExists(String id) {
    log.info("checkIfEmployeeExists is handling the request");
    return userService.isUserExists(id);
  }
}
