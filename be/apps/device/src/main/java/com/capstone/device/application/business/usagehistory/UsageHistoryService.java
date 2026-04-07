package com.capstone.device.application.business.usagehistory;

import com.capstone.device.application.dto.response.usagehistory.AnalysisResponse;
import com.capstone.device.application.dto.response.usagehistory.UsageResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import com.capstone.device.application.dto.response.pricetype.PendingReviewResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UsageHistoryService {
  UsageResponse addWaterIndexOfThisMonth(String imageUrl, String serial, BigDecimal index, LocalDate recordingDate, String status);

  AnalysisResponse extractDataFromTheMeterImage(MultipartFile file);

  void updatePaymentStatus(String serial, String method);

  List<UsageResponse> getUsageByCustomerIds(Collection<String> customerIds);

  UsageResponse updateUsageDetails(String serial, LocalDate recordingDate, BigDecimal index);

  // New method to get usage history by customer ID
  UsageResponse getUsageHistoryByCustomerId(String customerId);

  UsageResponse getTheLatestUsageHistoryBySerial(String serial);

  List<PendingReviewResponse> getPendingReviews(String roadmapId);

  void confirmMeterReading(String reviewId, BigDecimal finalIndex, String status);

  UsageResponse getRecentUsage(String customerId);

  String getLatestImage(String customerId);
}
