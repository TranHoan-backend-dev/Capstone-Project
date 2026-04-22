package com.capstone.device.application.usecase;

import com.capstone.common.utils.Utils;
import com.capstone.device.application.business.usagehistory.UsageHistoryService;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.history.AnalysisRequest;
import com.capstone.device.application.dto.request.history.UsageHistoryRequest;
import com.capstone.device.application.dto.response.pricetype.PendingReviewResponse;
import com.capstone.device.application.dto.response.usagehistory.AnalysisResponse;
import com.capstone.device.application.dto.response.usagehistory.UsageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.capstone.device.infrastructure.service.GcsService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UsageHistoryUseCase {
  WaterMeterService waterMeterService;
  UsageHistoryService usageHistoryService;
  GcsService service;

  public UsageResponse updateWaterIndex(UsageHistoryRequest request, String serial) {
    if (!waterMeterService.isWaterMeterExisting(serial)) {
      throw new IllegalArgumentException("Serial " + serial + " does not exist");
    }

    var lastUsage = usageHistoryService.getTheLatestUsageHistoryBySerial(serial);
    if (lastUsage != null && lastUsage.usagesList().getFirst().getStatus().equals("PENDING")) {
      return usageHistoryService.updateUsageDetails(serial, request.recordingDate(), request.index());
    }
    return null;
  }

  public AnalysisResponse analysisTheMeterImageWithSerial(AnalysisRequest request, String serial) {
    if (serial != null) {
      if (!waterMeterService.isWaterMeterExisting(serial)) {
        throw new IllegalArgumentException("Serial " + serial + " does not exist");
      }
    }
    var response = usageHistoryService.extractDataFromTheMeterImage(request.image());
    serial = serial != null ? serial : response.serial();

    var index = response.index() == null ? "0" : response.index();
    if (serial != null && response.index() != null) {
      var meterOpt = waterMeterService.getWaterMeterById(serial);
      System.out.println(meterOpt);
      if (meterOpt != null) {
        var indexLength = meterOpt.indexLength();
        System.out.println("Type:  " + indexLength);

        log.info("detected index length: {}", indexLength);
        if (indexLength < Integer.parseInt(index)) {
          log.info("Trimming index from {} to {} based on meter indexLength length {}", index, index.substring(0, indexLength), indexLength);
          index = index.substring(0, indexLength);
        }
      }
    }

    // Nếu AI không nhận diện được Serial, thử lấy từ CustomerId cấp bởi Client
    if (serial == null && request.customerId() != null) {
      try {
        var customerUsageHistory = usageHistoryService.getUsageHistoryByCustomerId(request.customerId());
        if (customerUsageHistory != null) {
          serial = customerUsageHistory.serial();
        }
      } catch (Exception e) {
        log.warn("Could not resolve serial for customerId: {} - {}", request.customerId(), e.getMessage());
      }
    }

    // Upload to GCS
    // var imageUrl = service.upload(request.image());
    var imageUrl = Utils.saveFile(request.image()); // Mock URL for now

    usageHistoryService.addWaterIndexOfThisMonth(imageUrl, serial,
      BigDecimal.valueOf(Long.parseLong(index)), request.recordingDate(), "PENDING");

    var monthStr = request.recordingDate().format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy"));

    return AnalysisResponse.builder()
      .id(serial + "_" + monthStr)
      .serial(serial)
      .index(index)
      .build();
  }

  public void updatePaymentStatus(String serial, String method) {
    usageHistoryService.updatePaymentStatus(serial, method);
  }

  public UsageResponse updateUsage(String serial, LocalDate recordingDate, BigDecimal index, String imageUrl) {
    return usageHistoryService.updateUsageDetails(serial, recordingDate, index);
  }

  public List<UsageResponse> getUsageByCustomerIds(Collection<String> customerIds) {
    return usageHistoryService.getUsageByCustomerIds(customerIds);
  }

  public List<PendingReviewResponse> getPendingReviews(String roadmapId) {
    return usageHistoryService.getPendingReviews(roadmapId);
  }

  public UsageResponse getUsageHistoryByCustomerId(String customerId) {
    return usageHistoryService.getUsageHistoryByCustomerId(customerId);
  }

  public UsageResponse getRecentUsage(String customerId) {
    return usageHistoryService.getRecentUsage(customerId);
  }

  public String getLatestImage(String customerId) {
    return usageHistoryService.getLatestImage(customerId);
  }
}
