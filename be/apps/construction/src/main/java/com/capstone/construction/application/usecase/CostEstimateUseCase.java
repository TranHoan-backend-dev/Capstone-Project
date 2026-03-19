package com.capstone.construction.application.usecase;

import com.capstone.common.enumerate.RoleName;
import com.capstone.common.exception.ForbiddenException;
import com.capstone.common.exception.NotExistingException;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.estimate.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.EstimateFilterRequest;
import com.capstone.construction.application.dto.request.estimate.SignRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.estimate.ApproveEvent;
import com.capstone.construction.application.event.producer.estimate.RequireSignificanceEvent;
import com.capstone.construction.application.event.producer.estimate.UpdatedEvent;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.utils.Message;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CostEstimateUseCase {
  final CostEstimateService estSrv;
  final EmployeeService empSrv;
  final MessageProducer messageProducer;

  // <editor-fold> desc="constant"
  @Value(".${rabbit-mq-config.entities[6]}.")
  String COST_ESTIMATE_PREFIX;

  @Value(".${rabbit-mq-config.entities[8]}.")
  String FINANCE_PREFIX;

  @Value("${rabbit-mq-config.actions[3]}")
  String APPROVE_ACTION;

  @Value("${rabbit-mq-config.actions[0]}")
  String UPDATE_ACTION;

  @Value("${rabbit-mq-config.actions[5]}")
  String REQUIRE_SIGNIFICANCE_ACTION;

  @Value("${rabbit-mq-config.actions[6]}")
  String VIEW_ACTION;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;
  // </editor-fold>

  public CostEstimateResponse createEstimate(@NonNull CreateRequest request) {
    return estSrv.createEstimate(request);
  }

  public CostEstimateResponse updateEstimate(String id, @NonNull UpdateRequest request) {
    var result = estSrv.updateEstimate(id, request);

    if (request.isFinished()) {
      var routingKey = QUEUE_NAME + COST_ESTIMATE_PREFIX + UPDATE_ACTION;
      var employee = empSrv.getEmployeeNameById(result.createBy());
      var event = new UpdatedEvent(
        result.customerName(),
        result.installationFormId().getFormCode(),
        result.installationFormId().getFormNumber(),
        employee.data().toString());
      messageProducer.send(routingKey, event);
    }

    return result;
  }

  public CostEstimateResponse approveEstimate(String id, @NonNull Boolean status) {
    estSrv.approveEstimate(id, status);

    var result = estSrv.getEstimateById(id);

    var routingKey = QUEUE_NAME + COST_ESTIMATE_PREFIX + APPROVE_ACTION;
    var employee = empSrv.getEmployeeNameById(result.createBy());
    var event = new ApproveEvent(
      result.customerName(),
      result.installationFormId().getFormCode(),
      result.installationFormId().getFormNumber(),
      employee.data().toString(),
      status,
      result.createBy());
    messageProducer.send(routingKey, event);

    return result;
  }

  public CostEstimateResponse getEstimateById(String id) {
    return estSrv.getEstimateById(id);
  }

  public PageResponse<CostEstimateResponse> getAllEstimates(Pageable pageable, EstimateFilterRequest request) {
    return estSrv.getAllEstimates(pageable, request);
  }

  public void assignStaffForSignCostEstimate(@NonNull AssignTheSignificanceRequest request) {
    var status = estSrv.isExisting(request.estId());
    var status1 = empSrv.isEmployeeExisting(request.surveyStaff()).data().toString();
    var status2 = empSrv.isEmployeeExisting(request.plHead()).data().toString();
    var status3 = empSrv.isEmployeeExisting(request.companyLeadership()).data().toString();

    if (!status) {
      throw new NotExistingException(String.format(Message.PT_61, request.estId()));
    }
    if (!Boolean.parseBoolean(status1) && !Boolean.parseBoolean(status2) && !Boolean.parseBoolean(status3)) {
      throw new NotExistingException(Message.PT_59);
    }

    messageProducer.send(QUEUE_NAME + COST_ESTIMATE_PREFIX + REQUIRE_SIGNIFICANCE_ACTION, new RequireSignificanceEvent(
      request.estId(),
      request.surveyStaff(),
      request.plHead(),
      request.companyLeadership()
    ));
  }

  public void signForInstallationRequest(String currentUserId, @NonNull SignRequest request) {
    var role = empSrv.getRoleOfEmployeeById(currentUserId).data().toString();
    if (!role.equalsIgnoreCase(RoleName.SURVEY_STAFF.name()) &&
      !role.equalsIgnoreCase(RoleName.COMPANY_LEADERSHIP.name()) &&
      !role.equalsIgnoreCase(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD.name())) {
      throw new ForbiddenException(SharedMessage.MES_23);
    }

    var electronicSignificance = empSrv.getElectronicSignificance(currentUserId).data().toString();

    // ký với chữ ký. Đủ 3 chữ ký rồi thì mới làm được bước kế tiếp
    var status = estSrv.signForCostEstimate(electronicSignificance, RoleName.valueOf(role), request.estimateId());

    if (status) {
      // TODO: ban su kien cho phong tai vu
      // Thong diep khong di kem noi dung
      messageProducer.send(QUEUE_NAME + FINANCE_PREFIX + VIEW_ACTION, null);
    }
  }
}
