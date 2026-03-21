package com.capstone.construction.application.usecase;

import com.capstone.common.exception.NotExistingException;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.application.business.constructionrequest.ConstructionRequestService;
import com.capstone.construction.application.business.settlement.SettlementService;
import com.capstone.construction.application.dto.request.settlement.AssignTheSignificanceRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.request.settlement.UpdateSettlementStatusRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.settlement.RequireSignificanceEvent;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
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
    final InstallationFormRepository installationFormRepository;

    @Value(".${rabbit-mq-config.entities[8]}.")
    String PREFIX;

    @Value("${rabbit-mq-config.actions[3]}")
    String APPROVE_ACTION;

    @Value("${rabbit-mq-config.actions[5]}")
    String REQUIRE_SIGNIFICANCE_ACTION;

    @Value("${rabbit-mq-config.queue_name}")
    String QUEUE_NAME;

    public SettlementResponse createSettlement(@NonNull SettlementRequest request) {
        var installationForm = installationFormRepository.findById(new InstallationFormId(request.formCode(), request.formNumber()))
                .orElseThrow(() -> new NotExistingException(String.format(SharedMessage.MES_24, request.formNumber(), request.formCode())));
        var constructionRequest = constructionRequestService.getByInstallationForm(installationForm);
        if (!Boolean.parseBoolean(constructionRequest.isApproved())) {
            throw new IllegalStateException("Công trình chưa được phê duyệt, chưa thể lập quyết toán");
        }

        return settlementService.createSettlement(request);
    }

    public SettlementResponse updateSettlement(String id, SettlementRequest request) {
        return settlementService.updateSettlement(id, request);
    }

    public SettlementResponse getSettlementById(String id) {
        return settlementService.getSettlementById(id);
    }

    public PageResponse<SettlementResponse> getAllSettlements(Pageable pageable) {
        return settlementService.getAllSettlements(pageable);
    }

    public PageResponse<SettlementResponse> filterSettlements(SettlementFilterRequest filterRequest, Pageable pageable) {
        return settlementService.filterSettlements(filterRequest, pageable);
    }

    public void significance(SignificanceRequest request, String id) {
        // du 4 chu ky thi thong bao cho phong tai vu de phong tai vu yeu cau khach hang toi thanh toan quyet toan
        var status = settlementService.signSettlement(request, id);
        if (status) {
            var routingKey = QUEUE_NAME + PREFIX + APPROVE_ACTION;
            messageProducer.send(routingKey, null);
        }
    }

    public void assignStaffForSignCostEstimate(@NonNull AssignTheSignificanceRequest request) {
        var status = employeeService.isEmployeeExisting(request.companyLeadership()).data().toString();
        var status1 = employeeService.isEmployeeExisting(request.surveyStaff()).data().toString();
        var status2 = employeeService.isEmployeeExisting(request.plHead()).data().toString();
        var status3 = employeeService.isEmployeeExisting(request.constructionPresident()).data().toString();

        if (!Boolean.parseBoolean(status) || !Boolean.parseBoolean(status1) || !Boolean.parseBoolean(status2) || !Boolean.parseBoolean(status3)) {
            throw new NotExistingException(Message.PT_59);
        }
        if (!settlementService.isExistingSettlement(request.settlementId())) {
            throw new NotExistingException(Message.PT_03);
        }

        messageProducer.send(QUEUE_NAME + PREFIX + REQUIRE_SIGNIFICANCE_ACTION, new RequireSignificanceEvent(
                request.settlementId(),
                request.surveyStaff(),
                request.plHead(),
                request.companyLeadership(),
                request.constructionPresident()
        ));
    }

    public SettlementResponse updateSettlementStatus(String id, UpdateSettlementStatusRequest request) {
        return settlementService.updateSettlementStatus(id, request.status());
    }
}
