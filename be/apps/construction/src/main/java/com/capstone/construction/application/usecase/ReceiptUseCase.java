package com.capstone.construction.application.usecase;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.business.receipt.ReceiptService;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.receipt.CreatedEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptUseCase {
  final ReceiptService receiptService;
  final MessageProducer messageProducer;

  @Value("${rabbit-mq-config.entities[7]}")
  String ENTITY_NAME;

  @Value("${rabbit-mq-config.actions[2]}")
  String CREATE_ACTION;

  @Value("${rabbit-mq-config.queue_name}")
  String QUEUE_NAME;

  @Transactional(rollbackFor = Exception.class)
  public ReceiptResponse createReceipt(@NonNull CreateRequest request) {
    log.info("UseCase: Creating receipt for form: {}/{}", request.formCode(), request.formNumber());
    var response = receiptService.createReceipt(request);

    // Orchestrate event publication after successful service execution
    var routingKey = String.join(".", QUEUE_NAME, ENTITY_NAME, CREATE_ACTION);
    var event = new CreatedEvent(
      response.formCode(),
      response.formNumber(),
      response.receiptNumber(),
      response.customerName(),
      response.address(),
      response.paymentDate(),
      response.isPaid()
    );
    messageProducer.send(routingKey, event);

    return response;
  }

  @Transactional(rollbackFor = Exception.class)
  public ReceiptResponse updateReceipt(UpdateRequest request) {
    log.info("UseCase: Updating receipt for form: {}/{}", request.formCode(), request.formNumber());
    return receiptService.updateReceipt(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteReceipt(String formCode, String formNumber) {
    log.info("UseCase: Deleting receipt for form: {}/{}", formCode, formNumber);
    receiptService.deleteReceipt(formCode, formNumber);
  }

  public ReceiptResponse getReceipt(String formCode, String formNumber) {
    log.info("UseCase: Fetching receipt for form: {}/{}", formCode, formNumber);
    return receiptService.getReceipt(formCode, formNumber);
  }
}
