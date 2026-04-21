package com.capstone.construction.application.business.receipt;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.ReceiptFilterRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptListResponse;
import com.capstone.construction.application.dto.response.receipt.ReceiptResponse;
import com.capstone.construction.domain.model.Receipt;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.domain.model.utils.significance.ReceiptSignificance;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.ReceiptRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Slf4j
@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReceiptServiceImpl implements ReceiptService {
  ReceiptRepository receiptRepo;
  InstallationFormRepository ifRepo;
  CostEstimateRepository ceRepo;

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

    // Kiểm tra xem dự toán đã được tạo hay chưa
    var costEstimate = ceRepo.findByInstallationForm(form)
      .orElseThrow(() -> new IllegalArgumentException("Chưa tạo dự toán cho đơn lắp đặt này."));

    // Kiểm tra xem dự toán đã được duyệt hoàn toàn bởi nhân viên khảo sát, trưởng
    // phòng KH-KT và lãnh đạo hay chưa
    if (costEstimate.getSignificance() == null || !costEstimate.getSignificance().isCostEstimateFullySigned()) {
      throw new IllegalArgumentException("Dự toán chưa được ký duyệt đầy đủ bởi các bộ phận liên quan.");
    }

    var receipt = Receipt.builder()
      .installationForm(form)
      .receiptNumber(request.receiptNumber())
      .customerName(form.getCustomerName())
      .address(form.getAddress())
      .attach(request.attach())
      .paymentReason(request.paymentReason())
      .totalMoneyInDigits(request.totalMoneyInDigit())
      .totalMoneyInCharacters(request.totalMoneyInCharacters())
      .paymentDate(request.paymentDate())
      .isPaid(request.isPaid())
      .significance(ReceiptSignificance.builder()
        .receiptCreator(request.significanceOfReceiptCreator())
        .build())
      .build();

    var saved = receiptRepo.save(receipt);
    log.info("Receipt saved with id: {}", saved.getInstallationFormId());

    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public ReceiptResponse updateReceipt(@NonNull UpdateRequest request) {
    log.info("Updating receipt for form: {}/{}", request.formCode(), request.formNumber());
    var formId = new InstallationFormId(request.formCode(), request.formNumber());
    var receipt = receiptRepo.findById(formId)
      .orElseThrow(
        () -> new IllegalArgumentException("Khong tim thay phieu thu voi so don: " + request.formNumber()));

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
    if (request.significanceOfTreasurer() != null && !request.significanceOfTreasurer().isBlank()) {
      var significance = receipt.getSignificance();
      significance.setTreasurer(request.significanceOfTreasurer());
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
  @Transactional(readOnly = true)
  public Page<ReceiptListResponse> getReceipts(ReceiptFilterRequest filter, Pageable pageable) {
    log.info("Fetching receipts with filter: {}", filter);

    var spec = ReceiptRepository.search(
      filter.keyword(),
      filter.from() != null ? LocalDate.parse(filter.from(), DateTimeFormatter.ofPattern("dd-MM-yyyy")) : null,
      filter.to() != null ? LocalDate.parse(filter.to(), DateTimeFormatter.ofPattern("dd-MM-yyyy")) : null,
      filter.isPaid(),
      filter.formCode(),
      filter.formNumber(),
      filter.receiptNumber());

    return receiptRepo.findAll(spec, pageable)
      .map(this::mapToListResponse);
  }

  @Override
  public String getLastCode() {
    log.info("Fetching last code for receipt");
    return receiptRepo.findTopByOrderByCreatedAtDesc().getReceiptNumber();
  }

  @Override
  public ReceiptResponse getReceipt(String formCode, String formNumber) {
    log.info("Fetching receipt for form: {}/{}", formCode, formNumber);
    return receiptRepo.findById(new InstallationFormId(formCode, formNumber))
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Receipt not found for form: " + formNumber));
  }

  private @NonNull ReceiptResponse mapToResponse(@NonNull Receipt receipt) {
    return new ReceiptResponse(
      receipt.getInstallationFormId().getFormCode(),
      receipt.getInstallationFormId().getFormNumber(),
      receipt.getReceiptNumber(),
      receipt.getCustomerName(),
      receipt.getAddress(),
      receipt.getPaymentDate(),
      receipt.getIsPaid(),
      receipt.getPaymentReason(),
      receipt.getTotalMoneyInDigits(),
      receipt.getTotalMoneyInCharacters(),
      receipt.getAttach(),
      receipt.getSignificance(),
      receipt.getCreatedAt(),
      receipt.getUpdatedAt());
  }

  private @NonNull ReceiptListResponse mapToListResponse(@NonNull Receipt receipt) {
    return new ReceiptListResponse(
      receipt.getInstallationFormId().getFormCode(),
      receipt.getInstallationFormId().getFormNumber(),
      receipt.getReceiptNumber(),
      receipt.getCustomerName(),
      receipt.getAddress(),
      receipt.getPaymentDate(),
      receipt.getIsPaid(),
      receipt.getCreatedAt(),
      receipt.getUpdatedAt());
  }
}
