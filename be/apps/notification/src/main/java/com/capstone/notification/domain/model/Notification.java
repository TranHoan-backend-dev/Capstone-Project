package com.capstone.notification.domain.model;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
  String id;
  String link;
  String message;
  Boolean status;
  LocalDateTime createdAt;
  String userId;
}
