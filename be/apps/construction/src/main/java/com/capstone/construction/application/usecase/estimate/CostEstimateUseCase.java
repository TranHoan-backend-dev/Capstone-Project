package com.capstone.construction.application.usecase.estimate;

import com.capstone.common.exception.NotExistingException;
import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.estimate.CreatedEvent;
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
  final InstallationFormService ifSrv;

  @Value(".${rabbit-mq-config.entities[6]}.")
  String PREFIX;

  @Value("${rabbit-mq-config.actions[2]}")
  String CREATE_ACTION;

  @Value("${rabbit-mq-config.actions[3]}")
  String APPROVE_ACTION;

  @Value("${rabbit-mq-config.actions[0]}")
  String UPDATE_ACTION;

  @Value("${rabbit-mq-config.actions[4]}")
  String REJECT_ACTION;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;

  public CostEstimateResponse createEstimate(@NonNull CreateRequest request) {
    checkInstallationForm(request.formCode(), request.formNumber());

    var result = estSrv.createEstimate(request);

    var routingKey = QUEUE_NAME + PREFIX + CREATE_ACTION;
    var employee = empSrv.getEmployeeNameById(result.createBy());
    var event = new CreatedEvent(
      result.customerName(),
      result.installationFormId().getFormCode(),
      result.installationFormId().getFormNumber(),
      employee.data().toString());
    messageProducer.send(routingKey, event);

    return result;
  }

  public CostEstimateResponse updateEstimate(String id, @NonNull UpdateRequest request) {
    var result = estSrv.updateEstimate(id, request);

    var routingKey = QUEUE_NAME + PREFIX + UPDATE_ACTION;
    var employee = empSrv.getEmployeeNameById(result.createBy());
    var event = new UpdatedEvent(
      result.customerName(),
      result.installationFormId().getFormCode(),
      result.installationFormId().getFormNumber(),
      employee.data().toString());
    messageProducer.send(routingKey, event);

    return result;
  }

  public CostEstimateResponse getEstimateById(String id) {
    return estSrv.getEstimateById(id);
  }

  public PageResponse<CostEstimateResponse> getAllEstimates(Pageable pageable, BaseFilterRequest request) {
    return estSrv.getAllEstimates(pageable, request);
  }

  private void checkInstallationForm(String formCode, String formNumber) {
    if (!ifSrv.isInstallationFormExisting(formNumber, formCode)) {
      throw new NotExistingException(String.format(Message.PT_59, formNumber, formCode));
    }
  }
}
