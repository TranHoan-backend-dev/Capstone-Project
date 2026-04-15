package com.capstone.construction.application.usecase;

import com.capstone.common.exception.NotExistingException;
import com.capstone.construction.application.business.constructionrequest.ConstructionRequestService;
import com.capstone.construction.application.business.settlement.SettlementService;
import com.capstone.construction.application.dto.request.settlement.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.CreateSettlementRequest;
import com.capstone.construction.application.dto.request.settlement.UpdateSettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.settlement.RequireSignificanceEvent;
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
public class SettlementUseCase {
  final SettlementService settlementService;
  final MessageProducer messageProducer;
  final EmployeeService employeeService;
  final ConstructionRequestService constructionRequestService;

  @Value(".${rabbit-mq-config.entities[8]}.")
  String PREFIX;

  @Value("${rabbit-mq-config.actions[3]}")
  String APPROVE_ACTION;

  @Value("${rabbit-mq-config.actions[5]}")
  String REQUIRE_SIGNIFICANCE_ACTION;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;

  public SettlementResponse createSettlement(@NonNull CreateSettlementRequest request) {
    if (settlementService.isExistingSettlement(request.settlementId())) {
      throw new IllegalStateException("Quyết toán đã tồn tại");
    }

    var constructionRequest = constructionRequestService.getByInstallationForm(request.formCode(), request.formNumber());
    if (constructionRequest == null) {
      throw new IllegalStateException("Công trình chưa được giao thi công, không thể lập quyết toán");
    }
    if (!Boolean.parseBoolean(constructionRequest.isApproved())) {
      throw new IllegalStateException("Công trình chưa được phê duyệt, chưa thể lập quyết toán");
    }
    // kiem tra xem settlement da ton tai voi installation form nay hay chua
    var status = settlementService.checkSettlementExists(request.formCode(), request.formNumber());
    if (status) {
      throw new NotExistingException("Quyet toan da ton tai");
    }

    return settlementService.createSettlement(request);
  }

  public SettlementResponse updateSettlement(String settlementId, UpdateSettlementRequest request) {
    return settlementService.updateSettlement(settlementId, request);
  }

  public SettlementResponse getSettlementById(String settlementId) {
    return settlementService.getSettlementById(settlementId);
  }

  public PageResponse<SettlementResponse> getAllSettlements(Pageable pageable) {
    return settlementService.getAllSettlements(pageable);
  }

  public PageResponse<SettlementResponse> filterSettlements(SettlementFilterRequest filterRequest, Pageable pageable) {
    return settlementService.filterSettlements(filterRequest, pageable);
  }

  public void significance(String userId, String id, SignificanceRequest request) {
    // du 4 chu ky thi thong bao cho phong tai vu de phong tai vu yeu cau khach hang toi thanh toan quyet toan
    var settlement = settlementService.getSettlementById(id);
    if (settlement.generalInformation().significance().isSettlementFullySigned()) {
      throw new IllegalArgumentException("Tài liệu đã được ký đầy đủ");
    }

    var status = settlementService.signSettlement(userId, id, request);
    if (status) {
      var routingKey = QUEUE_NAME + PREFIX + APPROVE_ACTION;
      messageProducer.send(routingKey, null);
    }
  }

  public void assignStaffForSignCostEstimate(@NonNull AssignTheSignificanceRequest request) {
    var status = employeeService.isEmployeeExisting(request.companyLeadership()).data().toString();
    var status1 = employeeService.isEmployeeExisting(request.surveyStaff()).data().toString();
    var status2 = employeeService.isEmployeeExisting(request.plHead()).data().toString();

    if (!Boolean.parseBoolean(status) || !Boolean.parseBoolean(status1) || !Boolean.parseBoolean(status2)) {
      throw new NotExistingException(Message.PT_59);
    }
    if (!settlementService.isExistingSettlement(request.settlementId())) {
      throw new NotExistingException(Message.PT_03);
    }

    messageProducer.send(QUEUE_NAME + PREFIX + REQUIRE_SIGNIFICANCE_ACTION, new RequireSignificanceEvent(
      request.settlementId(),
      request.surveyStaff(),
      request.plHead(),
      request.companyLeadership()
    ));
  }
}
