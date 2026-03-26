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

  @Override
  @Transactional
  public UsageResponse addWaterIndexOfThisMonth(String imageUrl, String serial, BigDecimal index, LocalDate recordingDate) {
    var meter = waterMeterRepository.findById(serial).orElseThrow(() -> new NotExistingException("Không tìm thấy thiết bị: " + serial));
    var history = repository.findByMeter(meter).orElseGet(() -> {
      return UsageHistory.builder()
          .usageHistory(serial)
          .meter(meter)
          .usages(new LinkedHashMap<>())
          .build();
    });

    String monthStr = recordingDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));
    history.addOrUpdateUsage(monthStr, index);
    history = repository.save(history);

    try {
      String customerId = customerService.getCustomerIdByMeterId(serial);
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
    // Tính năng payment status không được hỗ trợ trong thiết kế Map JSONB đơn giản {"yyyy-MM": index}
  }

  @Override
  public UsageResponse getUsageHistoryByCustomerId(String customerId) {
    log.info("Get usage history for customer {}", customerId);

    var customerInfo = getCustomerInfo(customerId);
    var waterMeterId = customerInfo.waterMeterId();
    if(waterMeterId == null) {
        throw new NotExistingException("Khách hàng chưa được gán đồng hồ nước: " + customerId);
    }

    var meter = waterMeterRepository.findById(waterMeterId).orElseThrow(() -> new NotExistingException("Không tìm thấy đồng hồ nước của khách hàng!"));
    var history = repository.findByMeter(meter).orElseThrow(() -> new NotExistingException("Không tìm thấy lịch sử sử dụng nước cho khách hàng: " + customerId));
    
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
    var meter = waterMeterRepository.findById(serial).orElseThrow(() -> new NotExistingException("Không tìm thấy thiết bị mang serial: " + serial));
    var history = repository.findByMeter(meter).orElseThrow(() -> new NotExistingException("Không tìm thấy lịch sử sử dụng cho serial: " + serial));

    String monthStr = recordingDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));
    history.addOrUpdateUsage(monthStr, index);
    history = repository.save(history);

    try {
      String customerId = customerService.getCustomerIdByMeterId(serial);
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
    return Collections.emptyList(); // Không hỗ trợ duyệt chỉ số trên thiết kế map JSONB tối giản hiện tại
  }

  @Override
  @Transactional
  public void confirmMeterReading(String reviewId, BigDecimal finalIndex, String status) {
    // Không hỗ trợ chức năng phê duyệt cho jsonb {"yyyy-MM": index}
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
      // Sắp xếp khóa dữ liệu (tháng/năm) đúng thứ tự biên niên
      List<String> sortedKeys = new ArrayList<>(entity.getUsages().keySet());
      Collections.sort(sortedKeys);

      BigDecimal previousIndex = BigDecimal.ZERO;

      for (String monthStr : sortedKeys) {
        BigDecimal index = entity.getUsages().get(monthStr);
        BigDecimal mass = index.subtract(previousIndex);
        if (mass.compareTo(BigDecimal.ZERO) < 0) {
          mass = BigDecimal.ZERO; 
        }
        
        BigDecimal calculatedPrice = BigDecimal.ZERO;
        if (mass.compareTo(BigDecimal.ZERO) > 0 && waterChargeCalculator != null && waterPrice != null) {
            try {
                calculatedPrice = waterChargeCalculator.calculateProgressiveCharge(mass, waterPrice).totalAmount();
            } catch (Exception e) {
                log.warn("Lỗi tính tiền cho tháng {}: {}", monthStr, e.getMessage());
            }
        }

        Usage usage = Usage.builder()
            .id(monthStr)
            .recordingDate(LocalDate.parse(monthStr + "-01"))
            .index(index)
            .mass(mass)
            .price(calculatedPrice)
            .status("APPROVED")
            .isPaid(true)
            .build();

        usagesList.add(usage);
        previousIndex = index;
      }
      
      // Đảo ngược danh sách sang dạng stack (dữ liệu mới nhất lên đầu)
      Collections.reverse(usagesList);
    }

    return UsageResponse.builder()
        .serial(entity.getUsageHistory())
        .customerId(customerId)
        .customerName(customerName)
        .priceTypes(priceTypeResponses)
        .usagesList(usagesList)
        .tax(waterPrice.getTax())
        .environmentPrice(waterPrice.getEnvironmentPrice())
        .build();
  }
}

