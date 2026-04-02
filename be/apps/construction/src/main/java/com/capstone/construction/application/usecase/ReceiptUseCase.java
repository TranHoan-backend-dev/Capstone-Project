package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.receipt.ReceiptService;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.ReceiptFilterRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptListResponse;
import com.capstone.construction.application.dto.response.receipt.ReceiptResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.receipt.CreatedEvent;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
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
    return receiptService.createReceipt(request);
  }

  @Transactional(rollbackFor = Exception.class)
  public ReceiptResponse updateReceipt(@NonNull UpdateRequest request) {
    var response = receiptService.updateReceipt(request);

    if (response != null && response.isPaid() && response.significance().isReceiptFullySigned()) {
      // Orchestrate event publication after successful service execution
      var routingKey = String.join(".", QUEUE_NAME, ENTITY_NAME, CREATE_ACTION);
      var event = new CreatedEvent(
        response.formCode(),
        response.formNumber(),
        response.receiptNumber(),
        response.customerName(),
        response.address(),
        response.paymentDate()
      );
      messageProducer.send(routingKey, event);
    }
    return response;
  }

  @Transactional(rollbackFor = Exception.class)
  public void deleteReceipt(Long formCode, Long formNumber) {
    receiptService.deleteReceipt(formCode, formNumber);
  }

  public ReceiptResponse getReceipt(Long formCode, Long formNumber) {
    return receiptService.getReceipt(formCode, formNumber);
  }

  @Transactional(readOnly = true)
  public Page<ReceiptListResponse> getReceipts(ReceiptFilterRequest filter, Pageable pageable) {
    log.info("UseCase: Fetching receipts with filter: {}", filter);
    return receiptService.getReceipts(filter, pageable);
  }
}
