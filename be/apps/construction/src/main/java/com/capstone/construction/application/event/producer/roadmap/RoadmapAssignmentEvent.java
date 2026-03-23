package com.capstone.construction.application.event.producer.roadmap;

import lombok.Builder;

@Builder
public record RoadmapAssignmentEvent(
  String roadmapId,
  String roadmapName,
  String assignedStaffId,
  String oldStaffId,
  String action // ASSIGN, CANCEL, UPDATE
) {
}
