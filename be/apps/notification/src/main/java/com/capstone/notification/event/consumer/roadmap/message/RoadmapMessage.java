package com.capstone.notification.event.consumer.roadmap.message;

import lombok.Builder;

public record RoadmapMessage(
  RoadmapAssignmentData data,
  String pattern
) {
  @Builder
  public record RoadmapAssignmentData(
    String roadmapId,
    String roadmapName,
    String assignedStaffId,
    String oldStaffId,
    String action
  ) {
  }
}
