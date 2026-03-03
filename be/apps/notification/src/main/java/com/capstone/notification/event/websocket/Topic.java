package com.capstone.notification.event.websocket;

import com.capstone.common.enumerate.RoleName;
import org.jspecify.annotations.NonNull;

public enum Topic {
  GENERAL,
  PLANNING_TECHNICAL,
  CONSTRUCTION,
  BUSINESS,
  IT,
  FINANCE,
  LEADERSHIP;

  public static @NonNull String getTopic(@NonNull Topic topic) {
    switch (topic) {
      case PLANNING_TECHNICAL -> {
        return "/technical";
      }
      case CONSTRUCTION -> {
        return "/construction";
      }
      case BUSINESS -> {
        return "/business";
      }
      case IT -> {
        return "/it";
      }
      case FINANCE -> {
        return "/finance";
      }
      case LEADERSHIP -> {
        return "/leadership";
      }
      default -> {
        return "/notification";
      }
    }
  }

  public static @NonNull String getTopicOfPlanningTechnicalDepartment(@NonNull RoleName roleName) {
    switch (roleName) {
      case ORDER_RECEIVING_STAFF -> {
        return "/technical/order-receiving-staff";
      }
      case SURVEY_STAFF -> {
        return "/technical/survey-staff";
      }
      default -> {
        return "/technical/head";
      }
    }
  }
}
