package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.application.event.producer.order.ApproveEvent;
import com.capstone.construction.application.event.producer.order.CreatedEvent;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.order.RejectEvent;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.utils.Constant;
import com.capstone.construction.infrastructure.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstallationFormHandlingUseCase {
  final InstallationFormService ifSrv;
  final MessageProducer messageProducer;
  final EmployeeService empSrv;

  @Value(".${rabbit-mq-config.entities[5]}.")
  String PREFIX;

  @Value("${rabbit-mq-config.actions[2]}")
  String CREATE_ACTION;

  @Value("${rabbit-mq-config.actions[3]}")
  String APPROVE_ACTION;

  @Value("${rabbit-mq-config.actions[4]}")
  String REJECT_ACTION;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;

  public Page<InstallationFormListResponse> getPaginatedInstallationForms(Pageable pageable, BaseFilterRequest request) {
    return ifSrv.getInstallationForms(pageable, request);
  }

  @Transactional(rollbackFor = Exception.class)
  public NewInstallationFormResponse createNewInstallationRequest(@NonNull NewOrderRequest request) {
    var routingKey = QUEUE_NAME + PREFIX + CREATE_ACTION;
    if (ifSrv.isInstallationFormExisting(request.formNumber(), request.formCode())) {
      throw new ExistingItemException(Constant.SE_01);
    }

    var savedResponse = ifSrv.createNewInstallationForm(request);

    // Send notification event using the DTO data
    var event = new CreatedEvent(
      savedResponse.formNumber(),
      savedResponse.customerName(),
      savedResponse.formCode(),
      getCreatorName(savedResponse.creator()),
      savedResponse.createdAt().toLocalDate().toString());
    messageProducer.send(routingKey, event);

    return savedResponse;
  }

  public void approveInstallationForm(ApproveRequest request) {
    ifSrv.approveAndAssignInstallationForm(request);
    var order = ifSrv.getByFormCodeAndFormNumber(request.formCode(), request.formNumber());
    if (request.status()) {
      // gui su kien cho nhan vien khao sat
      var routingKey = QUEUE_NAME + PREFIX + APPROVE_ACTION;
      messageProducer.send(routingKey, new ApproveEvent(
        request.empId(),
        order.formCode(),
        order.formNumber(),
        order.creatorFullName(),
        order.customerName(),
        order.registrationAt()
      ));
    } else {
      var routingKey = QUEUE_NAME + PREFIX + REJECT_ACTION;
      messageProducer.send(routingKey, new RejectEvent(
        order.creator(),
        order.formCode(),
        order.formNumber(),
        order.customerName()
      ));
    }
  }

  public Page<InstallationFormListResponse> getPaginatedConstructionRequest(Pageable pageable, BaseFilterRequest request) {
    return null;
  }

  private String getCreatorName(String creator) {
    var empName = empSrv.getEmployeeNameById(creator);
    return empName.data().toString();
  }
}
