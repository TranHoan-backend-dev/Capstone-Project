package com.capstone.device.application.business.usagehistory;

import com.capstone.common.exception.NotExistingException;
import com.capstone.common.utils.SharedConstant;
import com.capstone.device.application.dto.response.AIResponse;
import com.capstone.device.application.dto.response.pricetype.PendingReviewResponse;
import com.capstone.device.application.dto.response.pricetype.PriceTypeResponse;
import com.capstone.device.application.dto.response.usagehistory.AnalysisResponse;
import com.capstone.device.application.dto.response.usagehistory.UsageResponse;
import com.capstone.device.application.dto.response.customer.CustomerWaterPriceRefResponse;
import com.capstone.device.domain.model.UsageHistory;
import com.capstone.device.domain.model.WaterMeter;
import com.capstone.device.domain.model.WaterPrice;
import com.capstone.device.domain.model.utils.Usage;
import com.capstone.device.infrastructure.persistence.UsageHistoryRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterPriceRepository;
import com.capstone.device.infrastructure.service.AIService;
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
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
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
  AIService aiService;

  @Override
  @Transactional
  public UsageResponse addWaterIndexOfThisMonth(
    String imageUrl, String serial, BigDecimal index,
    @NonNull LocalDate recordingDate, String status) {
    log.info("addWaterIndexOfThisMonth for serial {}", serial);
    var meter = findById(serial);
    // tim lich su tieu thu bang dong ho nuoc. Neu dong ho nuoc nay moi duoc su dung
    // thi tao moi
    var history = repository.findByMeter(meter).orElseGet(() -> UsageHistory.builder()
      .usageHistory(serial)
      .meter(meter)
      .usages(new ArrayList<>())
      .build());

    // Resolve customerId if not already in history
    if (history.getCustomerId() == null) {
      try {
        var customerId = customerService.getCustomerIdByMeterId(serial);
        if (customerId != null) {
          history.setCustomerId(customerId);
        }
      } catch (Exception e) {
        log.warn("Could not auto-resolve customerId for serial {}: {}", serial, e.getMessage());
      }
    }

    // So sanh voi chi so gan nhat trong lich su
    if (!history.getUsages().isEmpty()) {
      var latestUsage = history.getUsages().stream()
        .max(Comparator.comparing(Usage::getRecordingDate))
        .orElse(null);
      log.info("Lich su su dung nuoc thang gan day nhat: {}", latestUsage);

      if (latestUsage != null && latestUsage.getIndex().compareTo(index) > 0) {
        throw new IllegalArgumentException(
          "Chi so nuoc thang nay khong the it hon thang truoc (" + latestUsage.getIndex() + ")");
      }
    }
    log.info("Chi so dong ho nuoc thang nay: {}", index);

    var monthStr = recordingDate.format(DateTimeFormatter.ofPattern(SharedConstant.DATE_PATTERN));
    var newUsage = Usage.builder()
      .id(monthStr)
      .recordingDate(recordingDate)
      .index(index)
      .meterImageUrl(imageUrl)
      .status(status)
      .isPaid(false)
      .build();
    log.info("Lich su su dung nuoc thang nay: {}", newUsage);

    history.addOrUpdateUsage(newUsage);
    history = repository.save(history);

    var customerId = history.getCustomerId();
    if (customerId == null) {
      log.warn("Lưu bản ghi tiêu thụ không có customerId cho serial {}", serial);
      // Try fetching again to be sure for the response
      customerId = customerService.getCustomerIdByMeterId(serial);
    }

    var customerInfo = getCustomerInfo(customerId);
    return mapToResponse(history, customerId, customerInfo);
  }

  @Override
  public AnalysisResponse extractDataFromTheMeterImage(@NonNull MultipartFile file) {
    log.info("Sending image to AI: {} ({} bytes)", file.getOriginalFilename(), file.getSize());
    var response = aiService.sendWaterMeterImage(file);

    var serial = extractTheMeterSerial(response.results());
    var index = extractTheMeterIndex(response.results());

    log.info("detectedSerial: {}", serial);
    log.info("detectedIndex: {}", index);

    return AnalysisResponse.builder()
      .serial(serial)
      .index(index)
      .build();
  }

  @Override
  @Transactional
  public void updatePaymentStatus(String serial, String method) {
    log.info("Cập nhật thanh toán thiết bị {} với phương thức {}", serial, method);
    var meter = findById(serial);
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

    var meter = findById(waterMeterId);
    var history = repository.findByMeter(meter).orElse(new UsageHistory());

    return mapToResponse(history, customerId, customerInfo);
  }

  @Override
  public UsageResponse getTheLatestUsageHistoryBySerial(String serial) {
    log.info("[getTheLatestUsageHistoryBySerial] Get usage history for serial {}", serial);
    var meter = findById(serial);
    var history = repository.findByMeter(meter);
    if (history.isPresent()) {
      var customerId = customerService.getCustomerIdByMeterId(serial);
      if (customerId == null) {
        throw new IllegalArgumentException("Dong ho nuoc nay khong co khach hang nao su dung");
      }
      var lastUsage = history.get().getLastUsage();
      var customerInfo = getCustomerInfo(customerId);
      var response = UsageResponse.builder()
        .serial(serial)
        .customerId(customerId)
        .customerName(customerInfo.name())
        .priceTypes(null)
        .usagesList(List.of(lastUsage))
        .tax(null)
        .environmentPrice(null)
        .build();
      log.info("[getTheLatestUsageHistoryBySerial] response: {}", response);
      return response;
    }
    return null;
  }

  @Override
  public List<UsageResponse> getUsageByCustomerIds(Collection<String> customerIds) {
    log.info("getUsageByCustomerIds: {}", customerIds);
    List<UsageResponse> responses = new ArrayList<>();
    for (var cid : customerIds) {
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
  public UsageResponse updateUsageDetails(String serial, @NonNull LocalDate recordingDate, BigDecimal index) {
    var meter = findById(serial);
    var history = repository.findByMeter(meter)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy lịch sử sử dụng cho serial: " + serial));

    var lastUsage = history.getLastUsage();
    lastUsage.setRecordingDate(recordingDate);
    lastUsage.setIndex(index);
    lastUsage.setStatus("APPROVED");

    history.addOrUpdateUsage(lastUsage);
    history = repository.save(history);

    try {
      var customerId = customerService.getCustomerIdByMeterId(serial);
      if (customerId != null) {
        var customerInfo = getCustomerInfo(customerId);
        return mapToResponse(history, customerId, customerInfo);
      }
    } catch (Exception e) {
      log.warn("Lỗi khi đồng bộ khách hàng: {}", e.getMessage());
    }
    return null;
  }

  @Override
  public List<PendingReviewResponse> getPendingReviews(String roadmapId) {
    log.info("[getPendingReviews] Get pending reviews for roadmap {}", roadmapId);
    List<PendingReviewResponse> pendingReviews = new ArrayList<>();
    List<UsageHistory> histories;
    Map<String, CustomerWaterPriceRefResponse> customerMap = new HashMap<>();

    if (roadmapId != null && !roadmapId.isBlank()) {
      // Optimized path: Find customers by roadmap first
      log.info("Get customers by roadmap {}", roadmapId);
      var customerRes = customerService.getCustomersByRoadmapId(roadmapId);
      if (customerRes != null && customerRes.data() != null) {
        // Map data which is likely a Page/List of objects
        try {
          // Attempt to extract the content if it's a Page object
          List<?> contentList;
          if (customerRes.data() instanceof Map && ((Map<?, ?>) customerRes.data()).containsKey("content")) {
            contentList = (List<?>) ((Map<?, ?>) customerRes.data()).get("content");
            log.info("[getPendingReviews] contentList size: {}", contentList.size());
          } else if (customerRes.data() instanceof List) {
            contentList = (List<?>) customerRes.data();
          } else {
            contentList = Collections.emptyList();
          }

          List<CustomerWaterPriceRefResponse> customers = contentList.stream()
            .map(c -> objectMapper.convertValue(c, CustomerWaterPriceRefResponse.class))
            .filter(c -> c.waterMeterId() != null)
            .toList();
          log.info("[getPendingReviews] Customers size: {}", customers.size());

          List<String> customerIds = customers.stream()
            .map(CustomerWaterPriceRefResponse::customerId)
            .toList();
          log.info("[getPendingReviews] customerIds size: {}", customerIds.size());

          histories = repository.findAllByCustomerIdIn(customerIds);
          customerMap = customers.stream()
            .collect(Collectors.toMap(CustomerWaterPriceRefResponse::customerId, c -> c, (a, b) -> a));
        } catch (Exception e) {
          log.error("Lỗi khi xử lý dữ liệu khách hàng: {}", e.getMessage());
          histories = new ArrayList<>();
        }
      } else {
        histories = new ArrayList<>();
      }
    } else {
      // Fallback: Fetch all (though less efficient, it handles the null roadmapId
      // case)
      histories = repository.findAll();
    }
    log.info("[getPendingReviews] histories size: {}", histories.size());

    for (var history : histories) {
      var serial = history.getUsageHistory();
      var customerId = history.getCustomerId();
      var customerInfo = customerMap.get(customerId);

      // If customer info is not in map (e.g. roadmapId was null), fetch it
      // individually
      if (customerInfo == null) {
        try {
          if (customerId != null) {
            customerInfo = getCustomerInfo(customerId);
          } else {
            // Fallback to searching by meter id if customerId is currently null for some
            // reason
            customerId = customerService.getCustomerIdByMeterId(serial);
            if (customerId != null) {
              customerInfo = getCustomerInfo(customerId);
            }
          }
        } catch (Exception e) {
          log.warn("Could not find customer/info for meter: {}, customerId: {}", serial, customerId);
        }
      }

      if (customerInfo == null)
        continue;

      // Final check for roadmapId filter if it wasn't filtered by the initial query
      if (roadmapId != null && !roadmapId.isBlank() && !roadmapId.equals(customerInfo.roadmapId())) {
        continue;
      }

      // Sort usages to find previous index for "oldIndex"
      List<Usage> sortedUsages = history.getUsages().stream()
        .sorted(Comparator.comparing(Usage::getRecordingDate))
        .toList();

      for (int i = 0; i < sortedUsages.size(); i++) {
        var u = sortedUsages.get(i);
        if ("PENDING".equals(u.getStatus())) {
          BigDecimal oldIndex = (i > 0) ? sortedUsages.get(i - 1).getIndex() : BigDecimal.ZERO;

          pendingReviews.add(PendingReviewResponse.builder()
            .id(history.getMeter().getMeterId() + "_" + u.getId()) // Globally unique ID
            .serial(history.getMeter().getMeterId())
            .customerId(customerInfo.customerId())
            .customerName(customerInfo.name())
            .address(customerInfo.address())
            .oldIndex(oldIndex)
            .newIndexAI(u.getIndex())
            .imageUrl(resolveSignedUrl(u.getMeterImageUrl()))
            .status("PENDING")
            .routeId(customerInfo.roadmapId())
            .build());
        }
      }
    }
    log.info("[getPendingReviews] Total pending reviews found: {}", pendingReviews.size());

    // Sort by recording date descending
    pendingReviews.sort((a, b) -> b.id().compareTo(a.id()));

    return pendingReviews;
  }

  @Override
  @Transactional
  public void confirmMeterReading(@NonNull String reviewId, BigDecimal finalIndex, String status) {
    String actualUsageId = reviewId;
    String targetSerial = null;

    if (reviewId.contains("_")) {
      String[] parts = reviewId.split("_", 2);
      targetSerial = parts[0];
      actualUsageId = parts[1];
    }

    var histories = (targetSerial != null)
      ? List.of(repository.findById(targetSerial).orElseThrow(() -> new NotExistingException("Not found")))
      : repository.findAll();

    for (var history : histories) {
      var found = false;
      for (var u : history.getUsages()) {
        if (u.getId().equals(actualUsageId)) {
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

  private UsageResponse mapToResponse(@NonNull UsageHistory entity, String customerId,
                                      @NonNull CustomerWaterPriceRefResponse customerInfo) {
    var customer = customerService.isCustomerFree(customerId);
    var waterPrice = resolveWaterPrice(customerInfo.waterPriceId());
    log.info("Mapping usage response for price ID: {}", waterPrice != null ? waterPrice.getPriceId() : "null");
    List<PriceTypeResponse> priceTypeResponses = waterPrice != null && waterPrice.getPriceTypes() != null
      ? waterPrice.getPriceTypes().stream()
      .map(pt -> new PriceTypeResponse(pt.getPriceTypeId(), pt.getArea(), pt.getPrice()))
      .toList()
      : List.of();

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

        // neu khach hang thuoc dien duoc mien phi tien nuoc thi khong tinh tien nuoc nua
        if (!customer) {
          if (mass.compareTo(BigDecimal.ZERO) > 0 && waterChargeCalculator != null && waterPrice != null) {
            try {
              calculatedPrice = waterChargeCalculator.calculateProgressiveCharge(mass, waterPrice).totalAmount();
              log.info("[mapToResponse] Calculated price: {}", calculatedPrice);
            } catch (Exception e) {
              log.warn("Lỗi tính tiền cho tháng {}: {}", u.getRecordingDate(), e.getMessage());
            }
          }
        }

        u.setMass(mass);
        u.setPrice(calculatedPrice);

        // Resolve Signed URL for Mobile display
        u.setMeterImageUrl(resolveSignedUrl(u.getMeterImageUrl()));

        log.info("[mapToResponse] Mapping usage response: {}", u);
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
      .customerName(customerInfo.name())
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

  private String extractTheMeterSerial(@NonNull List<AIResponse.AIResponseData> input) {
    return input.stream()
      .filter(r -> r.label().equals(AIResponse.LabelType.SERIAL_NUMBER_REGION))
      .map(AIResponse.AIResponseData::text)
      .findFirst()
      .orElse(null);
  }

  private String extractTheMeterIndex(@NonNull List<AIResponse.AIResponseData> input) {
    return input.stream()
      .filter(i -> i.label().equals(AIResponse.LabelType.CURRENT_POINTER_READING_REGION))
      .map(AIResponse.AIResponseData::text)
      .findFirst()
      .orElse(null);
  }

  private WaterMeter findById(String serial) {
    return waterMeterRepository.findById(serial)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy đồng hồ nước mang serial: " + serial));
  }
}
