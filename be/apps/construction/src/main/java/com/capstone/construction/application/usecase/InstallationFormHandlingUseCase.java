package com.capstone.construction.application.usecase;

import com.capstone.common.enumerate.RoleName;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.application.event.producer.order.AssignEvent;
import com.capstone.construction.application.event.producer.order.CreatedEvent;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.utils.Message;
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

import java.time.LocalDateTime;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InstallationFormHandlingUseCase {
  final InstallationFormService ifSrv;
  final MessageProducer messageProducer;
  final CostEstimateUseCase costEstimateUseCase;
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

  public Page<InstallationFormListResponse> getPaginatedInstallationForms(Pageable pageable, BaseFilterRequest request) {
    return ifSrv.getInstallationForms(pageable, request);
  }

  @Transactional(rollbackFor = Exception.class)
  public NewInstallationFormResponse createNewInstallationRequest(String userId, @NonNull NewOrderRequest request) {
    var routingKey = QUEUE_NAME + PREFIX + CREATE_ACTION;
    if (ifSrv.isInstallationFormExisting(request.formNumber(), request.formCode())) {
      throw new ExistingItemException(Message.PT_53);
    }

    var savedResponse = ifSrv.createNewInstallationForm(userId, request);

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

  public void assignInstallationFormToSurveyStaff(InstallationFormId id, String empId) {
    var role = empSrv.getRoleOfEmployeeById(empId).data();
    Objects.requireNonNull(role);
    if (!role.toString().equalsIgnoreCase(RoleName.SURVEY_STAFF.name())) {
      throw new IllegalArgumentException(String.format(Message.PT_28, "nhân viên khảo sát"));
    }

    ifSrv.assignInstallationForm(empId, id, true);
    var form = ifSrv.getByFormCodeAndFormNumber(id.getFormCode(), id.getFormNumber());

    var routingKey = QUEUE_NAME + PREFIX + ASSIGN_ACTION;
    var event = new AssignEvent(
      form.formCode(),
      form.formNumber(),
      empId,
      true
    );
    messageProducer.send(routingKey, event);
  }

  public void approveInstallationForm(ApproveRequest request) {
    ifSrv.approveAndAssignInstallationForm(request);

    var installationForm = ifSrv.getByFormCodeAndFormNumber(request.formCode(), request.formNumber());

    if (request.status()) {
      costEstimateUseCase.createEstimate(new CreateRequest(
        installationForm.customerName(),
        installationForm.address(),
        LocalDateTime.parse(installationForm.registrationAt()),
        installationForm.creator(),
        request.formCode(),
        request.formNumber(),
        installationForm.overallWaterMeterId()
      ));
    }
  }

  private String getCreatorName(String creator) {
    var empName = empSrv.getEmployeeNameById(creator);
    return empName.data().toString();
  }
}
