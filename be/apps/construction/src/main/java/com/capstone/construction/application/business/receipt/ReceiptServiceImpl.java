package com.capstone.construction.application.business.receipt;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptResponse;
import com.capstone.construction.application.event.receipt.ReceiptCreatedEvent;
import com.capstone.construction.domain.model.Receipt;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.ReceiptRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReceiptServiceImpl implements ReceiptService {
  ReceiptRepository receiptRepo;
  InstallationFormRepository ifRepo;
  ApplicationEventPublisher eventPublisher;

  @Override
  @Transactional
  public ReceiptResponse createReceipt(@NonNull CreateRequest request) {
    log.info("Creating receipt for form: {}/{}", request.formCode(), request.formNumber());
    var formId = new InstallationFormId(request.formCode(), request.formNumber());
    var form = ifRepo.findById(formId)
      .orElseThrow(() -> new IllegalArgumentException("Installation form not found: " + request.formNumber()));

    if (receiptRepo.existsById(formId)) {
      throw new IllegalArgumentException("Receipt already exists for this form");
    }

    var receipt = Receipt.create(builder -> builder
      .installationForm(form)
      .receiptNumber(request.receiptNumber())
      .customerName(request.customerName())
      .address(request.address())
      .paymentDate(request.paymentDate())
      .isPaid(request.isPaid()));

    var saved = receiptRepo.save(receipt);
    log.info("Receipt saved with id: {}", saved.getInstallationFormId());

    eventPublisher.publishEvent(new ReceiptCreatedEvent(this, saved));

    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public ReceiptResponse updateReceipt(String formCode, String formNumber, @NonNull UpdateRequest request) {
    log.info("Updating receipt for form: {}/{}", formCode, formNumber);
    var formId = new InstallationFormId(formCode, formNumber);
    var receipt = receiptRepo.findById(formId)
      .orElseThrow(() -> new IllegalArgumentException("Receipt not found for form: " + formNumber));

    if (request.receiptNumber() != null) {
      receipt.setReceiptNumber(request.receiptNumber());
    }
    if (request.customerName() != null) {
      receipt.setCustomerName(request.customerName());
    }
    if (request.address() != null) {
      receipt.setAddress(request.address());
    }
    if (request.paymentDate() != null) {
      receipt.setPaymentDate(request.paymentDate());
    }
    if (request.isPaid() != null) {
      receipt.setIsPaid(request.isPaid());
    }

    var saved = receiptRepo.save(receipt);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public void deleteReceipt(String formCode, String formNumber) {
    log.info("Deleting receipt for form: {}/{}", formCode, formNumber);
    var formId = new InstallationFormId(formCode, formNumber);
    if (!receiptRepo.existsById(formId)) {
      throw new IllegalArgumentException("Receipt not found for form: " + formNumber);
    }
    receiptRepo.deleteById(formId);
  }

  @Override
  public ReceiptResponse getReceipt(String formCode, String formNumber) {
    log.info("Fetching receipt for form: {}/{}", formCode, formNumber);
    return receiptRepo.findById(new InstallationFormId(formCode, formNumber))
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Receipt not found for form: " + formNumber));
  }

  private ReceiptResponse mapToResponse(Receipt receipt) {
    return new ReceiptResponse(
      receipt.getInstallationFormId().getFormCode(),
      receipt.getInstallationFormId().getFormNumber(),
      receipt.getReceiptNumber(),
      receipt.getCustomerName(),
      receipt.getAddress(),
      receipt.getPaymentDate(),
      receipt.getIsPaid(),
      receipt.getCreatedAt(),
      receipt.getUpdatedAt()
    );
  }
}
