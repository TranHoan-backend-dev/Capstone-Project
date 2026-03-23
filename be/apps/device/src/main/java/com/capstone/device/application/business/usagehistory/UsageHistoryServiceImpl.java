package com.capstone.device.application.business.usagehistory;

import com.capstone.common.exception.NotExistingException;
import com.capstone.device.application.dto.response.pricetype.PriceTypeResponse;
import com.capstone.device.application.dto.response.pricetype.UsageResponse;
import com.capstone.device.application.dto.response.customer.CustomerWaterPriceRefResponse;
import com.capstone.device.domain.model.UsageHistory;
import com.capstone.device.domain.model.WaterPrice;
import com.capstone.device.domain.model.utils.Usage;
import com.capstone.device.infrastructure.persistence.UsageHistoryRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterPriceRepository;
import com.capstone.device.infrastructure.service.CustomerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UsageHistoryServiceImpl implements UsageHistoryService {
  UsageHistoryRepository repository;
  WaterMeterRepository waterMeterRepository;
  WaterPriceRepository waterPriceRepository;
  CustomerService customerService;
  WaterChargeCalculator waterChargeCalculator;
  ObjectMapper objectMapper;

  @Override
  @Transactional
  public UsageResponse addWaterIndexOfThisMonth(String imageUrl, String serial, BigDecimal index, LocalDate recordingDate) {
    var meter = waterMeterRepository.findWaterMeterById(serial);
    var h = repository.findByMeter(meter);

    var usage = Usage.builder()
      .index(index)
      .mass(null)
      .isPaid(false)
      .meterImageUrl(imageUrl)
      .paymentMethod(null)
      .price(null)
      .recordingDate(recordingDate)
      .build();

    if (h.isPresent()) {
      var history = h.get();
      var customerInfo = getCustomerInfo(history.getCustomerId());
      return getUsageResponse(imageUrl, index, recordingDate, usage, history, customerInfo);
    } else {
      var customerId = customerService.getCustomerIdByMeterId(meter.getId());
      var usageHistory = UsageHistory.builder()
        .usageHistory(meter.getId())
        .meter(meter)
        .customerId(customerId)
        .usages(new ArrayList<>())
        .build();
      var customerInfo = getCustomerInfo(customerId);
      return getUsageResponse(imageUrl, index, recordingDate, usage, usageHistory, customerInfo);
    }
  }

  @Override
  @Transactional
  public void updatePaymentStatus(String serial, String method) {
    var meter = waterMeterRepository.findWaterMeterById(serial);
    var h = repository.findByMeter(meter);
    h.ifPresent(history -> history.getLatestUsage().ifPresent(u -> {
      u.setIsPaid(true);
      u.setPaymentMethod(method);
      repository.save(history);
    }));
  }

  @Override
  public List<UsageResponse> getUsageByCustomerIds(Collection<String> customerIds) {
    var histories = repository.findAllByCustomerIdIn(customerIds);
    return histories.stream().map(h -> {
      var customerInfo = getCustomerInfo(h.getCustomerId());
      var waterPrice = resolveWaterPrice(customerInfo.waterPriceId());
      return mapToResponse(h, customerInfo.name(), waterPrice);
    }).collect(Collectors.toList());
  }

  @Override
  @Transactional
  public UsageResponse updateUsageDetails(String serial, LocalDate recordingDate, BigDecimal index, String imageUrl) {
    var meter = waterMeterRepository.findWaterMeterById(serial);
    var history = repository.findByMeter(meter)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy lịch sử sử dụng cho serial: " + serial));

    var usageOpt = history.getUsages().stream()
      .filter(u -> u.getRecordingDate() != null && u.getRecordingDate().equals(recordingDate))
      .findFirst();

    if (usageOpt.isEmpty()) {
      throw new NotExistingException("Không tìm thấy bản ghi sử dụng vào ngày: " + recordingDate);
    }

    var usage = usageOpt.get();
    var customerInfo = getCustomerInfo(history.getCustomerId());
    var waterPrice = resolveWaterPrice(customerInfo.waterPriceId());

    // Recalculate mass and price
    usage.setIndex(index);
    if (imageUrl != null) usage.setMeterImageUrl(imageUrl);

    // To recalculate mass correctly, we need the mass calculation logic
    // Actually, we can just call calculateMass again
    // But calculateMass uses the current history, so we should temporarily remove the updated one or handle it
    // For simplicity, let's just redo the logic for this specific record
    
    // Find previous index
    var previousIndex = history.getUsages().stream()
      .filter(u -> u.getIndex() != null)
      .filter(u -> u.getRecordingDate() != null && u.getRecordingDate().isBefore(recordingDate))
      .max(Comparator.comparing(Usage::getRecordingDate))
      .map(Usage::getIndex)
      .orElse(BigDecimal.ZERO);

    var mass = index.subtract(previousIndex);
    if (mass.compareTo(BigDecimal.ZERO) < 0) {
      throw new IllegalArgumentException("Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số kỳ trước (" + previousIndex + ")");
    }
    var massScaled = mass.setScale(2, RoundingMode.HALF_UP);
    usage.setMass(massScaled);
    
    var breakdown = waterChargeCalculator.calculateProgressiveCharge(massScaled, waterPrice);
    usage.setPrice(breakdown.totalAmount());

    return mapToResponse(repository.save(history), customerInfo.name(), waterPrice);
  }

  private UsageResponse getUsageResponse(
    String imageUrl, BigDecimal index, LocalDate recordingDate, @NonNull Usage usage,
    UsageHistory history, @NonNull CustomerWaterPriceRefResponse customerInfo
  ) {
    var waterPrice = resolveWaterPrice(customerInfo.waterPriceId());
    var mass = calculateMass(history, index, recordingDate);
    var breakdown = waterChargeCalculator.calculateProgressiveCharge(mass, waterPrice);

    usage.setMass(mass);
    usage.setMeterImageUrl(imageUrl);
    usage.setPrice(breakdown.totalAmount());

    history.addNewUsage(usage);
    return mapToResponse(repository.save(history), customerInfo.name(), waterPrice);
  }

  private @NonNull BigDecimal calculateMass(@NonNull UsageHistory history, @NonNull BigDecimal currentIndex, LocalDate recordingDate) {
    var previousIndex = history.getUsages().stream()
      .filter(u -> u.getIndex() != null)
      .filter(u -> u.getRecordingDate() == null || !u.getRecordingDate().isAfter(recordingDate))
      .max(Comparator.comparing(u -> u.getRecordingDate() == null ? LocalDate.MIN : u.getRecordingDate()))
      .map(Usage::getIndex)
      .orElse(BigDecimal.ZERO);

    var mass = currentIndex.subtract(previousIndex);
    if (mass.compareTo(BigDecimal.ZERO) < 0) {
      throw new IllegalArgumentException("Chỉ số nước mới phải lớn hơn hoặc bằng chỉ số kỳ trước");
    }
    return mass.setScale(2, RoundingMode.HALF_UP);
  }

  private CustomerWaterPriceRefResponse getCustomerInfo(String customerId) {
    var response = customerService.getCustomerById(customerId);
    if (response == null || response.data() == null) {
      throw new NotExistingException("Không lấy được thông tin khách hàng");
    }
    return objectMapper.convertValue(response.data(), CustomerWaterPriceRefResponse.class);
  }

  private WaterPrice resolveWaterPrice(String waterPriceId) {
    if (waterPriceId == null || waterPriceId.isBlank()) {
      throw new NotExistingException("Khách hàng chưa được gán bảng giá nước");
    }

    return waterPriceRepository.findById(waterPriceId)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy bảng giá nước"));
  }

  private UsageResponse mapToResponse(@NonNull UsageHistory entity, String customerName, @NonNull WaterPrice waterPrice) {
    log.info(waterPrice.getPriceId());
    var priceTypeResponses = waterPrice.getPriceTypes().stream()
      .map(pt -> new PriceTypeResponse(pt.getPriceTypeId(), pt.getArea(), pt.getPrice()))
      .toList();

    return UsageResponse.builder()
      .serial(entity.getUsageHistory())
      .customerId(entity.getCustomerId())
      .customerName(customerName)
      .priceTypes(priceTypeResponses)
      .usagesList(entity.getUsages())
      .tax(waterPrice.getTax())
      .environmentPrice(waterPrice.getEnvironmentPrice())
      .build();
  }
}
