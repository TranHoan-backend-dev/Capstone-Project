package com.capstone.device.application.usecase;

import com.capstone.device.application.business.usagehistory.UsageHistoryService;
import com.capstone.device.application.business.watermeter.WaterMeterService;
import com.capstone.device.application.dto.request.history.AnalysisRequest;
import com.capstone.device.application.dto.request.history.UsageHistoryRequest;
import com.capstone.device.application.dto.response.pricetype.PendingReviewResponse;
import com.capstone.device.application.dto.response.usagehistory.AnalysisResponse;
import com.capstone.device.application.dto.response.usagehistory.UsageResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.capstone.device.infrastructure.service.GcsService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.ModelAttribute;

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
  StringRedisTemplate redisTemplate;

  private static final String REDIS_KEY_PREFIX = "meter:image:url:";

  public UsageResponse updateWaterIndex(UsageHistoryRequest request, String serial) {
    if (!waterMeterService.isWaterMeterExisting(serial)) {
      throw new IllegalArgumentException("Serial " + serial + " does not exist");
    }

    var imageUrl = redisTemplate.opsForValue().get(REDIS_KEY_PREFIX + serial);
    if (imageUrl == null) {
      imageUrl = "";
    }

    var response = usageHistoryService.addWaterIndexOfThisMonth(imageUrl, serial, request.index(), request.recordingDate());

    // Clear cache after usage
    redisTemplate.delete(REDIS_KEY_PREFIX + serial);

    return response;
  }

  public AnalysisResponse analysisTheMeterImage(@ModelAttribute @Valid AnalysisRequest request, String serial) {
    if (!waterMeterService.isWaterMeterExisting(serial)) {
      throw new IllegalArgumentException("Serial " + serial + " does not exist");
    }

    // Upload to GCS
    var imageUrl = service.upload(request.image());

    // Cache to Redis with 10 minutes timeout
    redisTemplate.opsForValue().set(
      REDIS_KEY_PREFIX + serial,
      imageUrl,
      java.time.Duration.ofMinutes(10));

    return usageHistoryService.extractDataFromTheMeterImage(request.image());
  }

  public void updatePaymentStatus(String serial, String method) {
    usageHistoryService.updatePaymentStatus(serial, method);
  }

  public UsageResponse updateUsage(String serial, LocalDate recordingDate, BigDecimal index, String imageUrl) {
    return usageHistoryService.updateUsageDetails(serial, recordingDate, index, imageUrl);
  }

  public List<UsageResponse> getUsageByCustomerIds(Collection<String> customerIds) {
    return usageHistoryService.getUsageByCustomerIds(customerIds);
  }

  public List<PendingReviewResponse> getPendingReviews() {
    return usageHistoryService.getPendingReviews();
  }

  public void confirmMeterReading(String reviewId, BigDecimal finalIndex, String status) {
    usageHistoryService.confirmMeterReading(reviewId, finalIndex, status);
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
