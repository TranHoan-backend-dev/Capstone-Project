package com.capstone.notification.dto.response;

import java.util.List;

public record NotificationBatchResponse(
  List<NotificationResponse> items,
  int requestedSize,
  int totalFound
) {
}
