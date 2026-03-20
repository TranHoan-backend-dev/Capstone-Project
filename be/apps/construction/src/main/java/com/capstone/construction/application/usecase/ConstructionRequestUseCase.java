package com.capstone.construction.application.usecase;

import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.business.constructionrequest.ConstructionRequestService;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.construction.AssignRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.order.AssignEvent;
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

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConstructionRequestUseCase {
  final ConstructionRequestService constructionRequestService;
  final InstallationFormService ifSrv;
  final MessageProducer messageProducer;
  final EmployeeService empSrv;

  // <editor-fold> desc="constant"
  @Value(".${rabbit-mq-config.entities[5]}.")
  String PREFIX;

  @Value("${rabbit-mq-config.actions[2]}")
  String CREATE_ACTION;

  @Value("${rabbit-mq-config.actions[4]}")
  String ASSIGN_ACTION;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;
  // </editor-fold>

  public void assignToConstructionCaptain(@NonNull AssignRequest request, String empId) {
    constructionRequestService.createPendingRequest(
      empId, request.contractId(),
      request.formCode(), request.formNumber()
    );
    ifSrv.assignInstallationForm(empId, new InstallationFormId(request.formCode(), request.formNumber()), false);
    var form = ifSrv.getByFormCodeAndFormNumber(request.formCode(), request.formNumber());

    var routingKey = QUEUE_NAME + PREFIX + ASSIGN_ACTION;
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
}
