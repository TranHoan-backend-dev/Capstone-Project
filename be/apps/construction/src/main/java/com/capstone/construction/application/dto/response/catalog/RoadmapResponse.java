package com.capstone.construction.application.dto.response.catalog;

import java.time.LocalDateTime;

public record RoadmapResponse(
  String roadmapId,
  String name,
  String lateralId,
  String lateralName,
  String networkId,
  String networkName,
  LocalDateTime createdAt,
  String assignedStaffId,
  int numberOfCustomers
) {
}
