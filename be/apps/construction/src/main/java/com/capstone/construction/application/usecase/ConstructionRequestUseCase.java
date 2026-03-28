package com.capstone.construction.application.usecase;

import com.capstone.common.request.BaseFilterRequest;
import com.capstone.construction.application.business.constructionrequest.ConstructionRequestService;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.construction.AssignRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.order.AssignEvent;
import com.capstone.construction.application.event.producer.receipt.ApprovedEvent;
import com.capstone.construction.domain.model.utils.InstallationFormId;
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
public class ConstructionRequestUseCase {
  final ConstructionRequestService constructionRequestService;
  final InstallationFormService ifSrv;
  final MessageProducer messageProducer;
  final EmployeeService employeeService;

  // <editor-fold> desc="constant"
  @Value(".${rabbit-mq-config.entities[5]}.")
  String INSTALLATION_FORM_PREFIX;

  @Value(".${rabbit-mq-config.entities[9]}.")
  String CONSTRUCTION_REQUEST_PREFIX;

  @Value("${rabbit-mq-config.actions[4]}")
  String ASSIGN_ACTION;

  @Value("${rabbit-mq-config.actions[3]}")
  String APPROVED_ACTION;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;
  // </editor-fold>

  public void createAndAssignToConstructionCaptain(@NonNull AssignRequest request, String empId) {
    constructionRequestService.createPendingRequest(
      empId, request.contractId(),
      request.formCode(), request.formNumber()
    );
    ifSrv.assignInstallationForm(empId, new InstallationFormId(request.formCode(), request.formNumber()), false);
    var form = ifSrv.getByFormCodeAndFormNumber(request.formCode(), request.formNumber());

    var routingKey = QUEUE_NAME + INSTALLATION_FORM_PREFIX + ASSIGN_ACTION;
    var event = new AssignEvent(
      form.formCode(),
      form.formNumber(),
      empId,
      false
    );
    messageProducer.send(routingKey, event);
  }

  public Page<InstallationFormListResponse> getPaginatedConstructionRequest(Pageable pageable, BaseFilterRequest request) {
    return ifSrv.getConstructionRequestsList(pageable, request);
  }

  @Transactional(rollbackFor = Exception.class)
  public void approveTheConstruction(String id, Boolean approved) {
    constructionRequestService.approveTheConstruction(id, approved);
    var constructionRequest = constructionRequestService.getById(id);
    var installationForm = ifSrv.getByFormCodeAndFormNumber(constructionRequest.formCode(), constructionRequest.formNumber());
    var constructedBy = installationForm.constructedBy();

    if (approved) {
      // neu duoc phe duyet, gui su kien cho nhan vien Xay lap khac de ho lap quyet toan
      var routingKey = QUEUE_NAME + CONSTRUCTION_REQUEST_PREFIX + APPROVED_ACTION;
      messageProducer.send(routingKey, new ApprovedEvent(
        constructionRequest.formCode(),
        constructionRequest.formNumber(),
        employeeService.getEmployeeNameById(constructedBy).data().toString()
      ));
    }
  }
}
