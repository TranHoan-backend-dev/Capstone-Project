package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.pages.BusinessPageService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.users.FilterUsersRequest;
import com.capstone.auth.application.dto.request.UpdateBusinessPageNamesRequest;
import com.capstone.auth.application.dto.request.users.UpdateRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import com.capstone.auth.application.dto.response.NameAndIdResponse;
import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.event.producer.message.AccountDeleteEvent;
import com.capstone.auth.application.event.producer.message.AccountUpdateEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
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
  MessageProducer template;

  @NonFinal
  @Value("${sending_mail.delete_account.subject}")
  String DELETE_SUBJECT;

  @NonFinal
  @Value("${sending_mail.delete_account.template}")
  String DELETE_TEMPLATE;

  @NonFinal
  @Value("${sending_mail.update_account.subject}")
  String UPDATE_SUBJECT;

  @NonFinal
  @Value("${sending_mail.update_account.template}")
  String UPDATE_TEMPLATE;

  @Value("${rabbit-mq-config.update_account_routing_key}")
  @NonFinal
  String UPDATE_ROUTING_KEY;

  @Value("${rabbit-mq-config.delete_account_routing_key}")
  @NonFinal
  String DELETE_ROUTING_KEY;

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

  public EmployeeResponse updateEmployee(String id, UpdateRequest request) {
    var response = userService.updateEmployee(id, request);
    template.sendMessage(UPDATE_ROUTING_KEY, new AccountUpdateEvent(
      response.email(),
      response.fullName(),
      response.departmentName(),
      UPDATE_SUBJECT, UPDATE_TEMPLATE));
    return response;
  }

  public void deleteEmployee(String id) {
    var response = userService.deleteEmployee(id);
    template.sendMessage(DELETE_ROUTING_KEY, new AccountDeleteEvent(
      response.email(),
      response.fullName(),
      response.departmentName(),
      response.email(),
      DELETE_SUBJECT, DELETE_TEMPLATE));
  }

  public List<NameAndIdResponse> getListOfPtHeads() {
    return userService.getAllPtHeads();
  }

  public List<NameAndIdResponse> getListOfConstructionHeads() {
    return userService.getAllConstructionHeads();
  }

  public List<NameAndIdResponse> getListOfCompanyLeaderShips() {
    return userService.getAllLeaderShips();
  }
}
