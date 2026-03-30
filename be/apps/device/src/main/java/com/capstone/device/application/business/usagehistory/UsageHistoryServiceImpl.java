package com.capstone.device.application.business.usagehistory;

import com.capstone.common.exception.NotExistingException;
import com.capstone.device.application.dto.response.pricetype.PendingReviewResponse;
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
import com.capstone.device.infrastructure.service.GcsService;
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
import java.time.format.DateTimeFormatter;
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
  GcsService gcsService;

  @Override
  @Transactional
  public UsageResponse addWaterIndexOfThisMonth(String imageUrl, String serial, BigDecimal index,
                                                @NonNull LocalDate recordingDate) {
    log.info("addWaterIndexOfThisMonth");
    var meter = waterMeterRepository.findById(serial)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy thiết bị: " + serial));
    var history = repository.findByMeter(meter).orElseGet(() -> UsageHistory.builder()
      .usageHistory(serial)
      .meter(meter)
      .usages(new ArrayList<>())
      .build());

    var monthStr = recordingDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));
    var newUsage = Usage.builder()
      .id(monthStr)
      .recordingDate(recordingDate)
      .index(index)
      .meterImageUrl(imageUrl)
      .status("PENDING")
      .isPaid(false)
      .build();

    history.addOrUpdateUsage(newUsage);
    history = repository.save(history);

    try {
      var customerId = customerService.getCustomerIdByMeterId(serial);
      if (customerId != null) {
        var customerInfo = getCustomerInfo(customerId);
        var waterPrice = resolveWaterPrice(customerInfo.waterPriceId());
        return mapToResponse(history, customerId, customerInfo.name(), waterPrice);
      }
    } catch (Exception e) {
      log.warn("Lỗi khi kết nối tới dịch vụ khách hàng: " + e.getMessage());
    }
    return null;
  }

  @Override
  @Transactional
  public void updatePaymentStatus(String serial, String method) {
    log.info("Cập nhật thanh toán thiết bị {} với phương thức {}", serial, method);
    var meter = waterMeterRepository.findById(serial)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy thiết bị"));
    var history = repository.findByMeter(meter).orElseThrow(() -> new NotExistingException("Không tìm thấy lịch sử"));
    if (!history.getUsages().isEmpty()) {
      var latest = history.getUsages().stream().max(Comparator.comparing(Usage::getRecordingDate)).get();
      latest.setIsPaid(true);
      latest.setPaymentMethod(method);
      latest.setStatus("APPROVED");
      repository.save(history);
    }
  }

  @Override
  public UsageResponse getUsageHistoryByCustomerId(String customerId) {
    log.info("Get usage history for customer {}", customerId);

    var customerInfo = getCustomerInfo(customerId);
    log.info("CustomerInfo: {}", customerInfo);
    var waterMeterId = customerInfo.waterMeterId();
    if (waterMeterId == null) {
      throw new NotExistingException("Khách hàng chưa được gán đồng hồ nước: " + customerId);
    }
    log.info("WaterMeterId: {}", waterMeterId);

    var meter = waterMeterRepository.findById(waterMeterId)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy đồng hồ nước của khách hàng!"));
    var history = repository.findByMeter(meter).orElseThrow(
      () -> new NotExistingException("Không tìm thấy lịch sử sử dụng nước cho khách hàng: " + customerId));

    var waterPrice = resolveWaterPrice(customerInfo.waterPriceId());

    return mapToResponse(history, customerId, customerInfo.name(), waterPrice);
  }

  @Override
  public List<UsageResponse> getUsageByCustomerIds(Collection<String> customerIds) {
    log.info("getUsageByCustomerIds: {}", customerIds);
    List<UsageResponse> responses = new ArrayList<>();
    for (String cid : customerIds) {
      try {
        responses.add(getUsageHistoryByCustomerId(cid));
      } catch (Exception e) {
        log.warn("Không tìm thấy dữ liệu cho khách hàng {}: {}", cid, e.getMessage());
      }
    }
    return responses;
  }

  @Override
  @Transactional
  public UsageResponse updateUsageDetails(String serial, LocalDate recordingDate, BigDecimal index, String imageUrl) {
    var meter = waterMeterRepository.findById(serial)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy thiết bị mang serial: " + serial));
    var history = repository.findByMeter(meter)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy lịch sử sử dụng cho serial: " + serial));

    var monthStr = recordingDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));
    var newUsage = Usage.builder()
      .id(monthStr)
      .recordingDate(recordingDate)
      .index(index)
      .meterImageUrl(imageUrl)
      .status("APPROVED")
      .isPaid(true)
      .build();

    history.addOrUpdateUsage(newUsage);
    history = repository.save(history);

    try {
      var customerId = customerService.getCustomerIdByMeterId(serial);
      if (customerId != null) {
        var customerInfo = getCustomerInfo(customerId);
        var waterPrice = resolveWaterPrice(customerInfo.waterPriceId());
        return mapToResponse(history, customerId, customerInfo.name(), waterPrice);
      }
    } catch (Exception e) {
      log.warn("Lỗi khi đồng bộ khách hàng: " + e.getMessage());
    }
    return null;
  }

  @Override
  public List<PendingReviewResponse> getPendingReviews() {
    List<PendingReviewResponse> pendingReviews = new ArrayList<>();
    var histories = repository.findAll();
    for (var history : histories) {
      for (var u : history.getUsages()) {
        if ("PENDING".equals(u.getStatus())) {
          pendingReviews.add(PendingReviewResponse.builder()
            .id(u.getId())
            .serial(history.getUsageHistory())
            .newIndexAI(u.getIndex())
            .imageUrl(u.getMeterImageUrl())
            .status("PENDING")
            .build());
        }
      }
    }
    return pendingReviews;
  }

  @Override
  @Transactional
  public void confirmMeterReading(String reviewId, BigDecimal finalIndex, String status) {
    var histories = repository.findAll();
    for (var history : histories) {
      var found = false;
      for (var u : history.getUsages()) {
        if (u.getId().equals(reviewId)) {
          u.setIndex(finalIndex);
          u.setStatus(status);
          found = true;
          break;
        }
      }
      if (found) {
        repository.save(history);
        return;
      }
    }
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
      throw new NotExistingException("Không tìm thấy bảng giá nước");
    }

    return waterPriceRepository.findById(waterPriceId)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy bảng giá nước"));
  }

  private UsageResponse mapToResponse(@NonNull UsageHistory entity, String customerId, String customerName, WaterPrice waterPrice) {
    log.info("Mapping usage response for price ID: {}", waterPrice != null ? waterPrice.getPriceId() : "null");
    List<PriceTypeResponse> priceTypeResponses = waterPrice != null && waterPrice.getPriceTypes() != null ? waterPrice.getPriceTypes().stream()
      .map(pt -> new PriceTypeResponse(pt.getPriceTypeId(), pt.getArea(), pt.getPrice()))
      .toList() : List.of();

    List<Usage> usagesList = new ArrayList<>();
    if (entity.getUsages() != null && !entity.getUsages().isEmpty()) {
      // Sắp xếp theo ngày ghi nhận
      List<Usage> sortedUsages = entity.getUsages().stream()
        .sorted(Comparator.comparing(Usage::getRecordingDate))
        .toList();

      var previousIndex = BigDecimal.ZERO;

      for (var u : sortedUsages) {
        var mass = u.getIndex().subtract(previousIndex);
        if (mass.compareTo(BigDecimal.ZERO) < 0) {
          mass = BigDecimal.ZERO;
        }

        var calculatedPrice = BigDecimal.ZERO;
        if (mass.compareTo(BigDecimal.ZERO) > 0 && waterChargeCalculator != null && waterPrice != null) {
          try {
            calculatedPrice = waterChargeCalculator.calculateProgressiveCharge(mass, waterPrice).totalAmount();
          } catch (Exception e) {
            log.warn("Lỗi tính tiền cho tháng {}: {}", u.getRecordingDate(), e.getMessage());
          }
        }

        u.setMass(mass);
        u.setPrice(calculatedPrice);

        // Resolve Signed URL for Mobile display
        u.setMeterImageUrl(resolveSignedUrl(u.getMeterImageUrl()));

        usagesList.add(u);
        previousIndex = u.getIndex();
      }

      // Đảo ngược danh sách sang dạng stack (dữ liệu mới nhất lên đầu)
      usagesList = new ArrayList<>(usagesList);
      Collections.reverse(usagesList);
    }

    return UsageResponse.builder()
      .serial(entity.getUsageHistory())
      .customerId(customerId)
      .customerName(customerName)
      .priceTypes(priceTypeResponses)
      .usagesList(usagesList)
      .tax(waterPrice != null ? waterPrice.getTax() : BigDecimal.ZERO)
      .environmentPrice(waterPrice != null ? waterPrice.getEnvironmentPrice() : BigDecimal.ZERO)
      .build();
  }

  @Override
  public UsageResponse getRecentUsage(String customerId) {
    var fullHistory = getUsageHistoryByCustomerId(customerId);
    if (fullHistory == null || fullHistory.usagesList() == null) {
      return fullHistory;
    }

    // mapToResponse already sorted them Newest first
    List<Usage> recentUsages = fullHistory.usagesList().stream()
      .limit(3)
      .collect(Collectors.toList());

    return UsageResponse.builder()
      .serial(fullHistory.serial())
      .customerId(fullHistory.customerId())
      .customerName(fullHistory.customerName())
      .priceTypes(fullHistory.priceTypes())
      .usagesList(recentUsages)
      .tax(fullHistory.tax())
      .environmentPrice(fullHistory.environmentPrice())
      .build();
  }

  @Override
  public String getLatestImage(String customerId) {
    var fullHistory = getUsageHistoryByCustomerId(customerId);
    if (fullHistory == null || fullHistory.usagesList() == null || fullHistory.usagesList().isEmpty()) {
      return null;
    }
    // Newest is at index 0 because it was reversed in mapToResponse
    return fullHistory.usagesList().getFirst().getMeterImageUrl();
  }

  private String resolveSignedUrl(String storedUrl) {
    if (storedUrl == null || !storedUrl.startsWith("https://storage.googleapis.com/")) {
      return storedUrl;
    }
    try {
      // URL format: https://storage.googleapis.com/[BUCKET]/[FILENAME]
      String[] parts = storedUrl.split("/", 5);
      if (parts.length >= 5) {
        String fileName = parts[4];
        return gcsService.getSignedUrl(fileName);
      }
    } catch (Exception e) {
      log.error("Failed to resolve signed URL for {}: {}", storedUrl, e.getMessage());
    }
    return storedUrl;
  }
}
