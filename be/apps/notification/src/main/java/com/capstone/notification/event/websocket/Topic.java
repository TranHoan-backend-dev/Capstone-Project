package com.capstone.notification.event.websocket;

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
      case GENERAL -> {
        return "/notification";
      }
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
    }
    return "/notification";
  }
}
