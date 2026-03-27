package com.capstone.device.application.business.usagehistory;

import com.capstone.device.application.dto.response.pricetype.UsageResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import com.capstone.device.application.dto.response.pricetype.PendingReviewResponse;

public interface UsageHistoryService {
  UsageResponse addWaterIndexOfThisMonth(String imageUrl, String serial, BigDecimal index, LocalDate recordingDate);

  void updatePaymentStatus(String serial, String method);

  List<UsageResponse> getUsageByCustomerIds(Collection<String> customerIds);

  UsageResponse updateUsageDetails(String serial, LocalDate recordingDate, BigDecimal index, String imageUrl);

  // New method to get usage history by customer ID
  UsageResponse getUsageHistoryByCustomerId(String customerId);

  List<PendingReviewResponse> getPendingReviews();

  void confirmMeterReading(String reviewId, BigDecimal finalIndex, String status);

  UsageResponse getRecentUsage(String customerId);

  String getLatestImage(String customerId);
}
