package com.capstone.auth.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "individual_notification")
@FieldDefaults(level = AccessLevel.PRIVATE)
@IdClass(IndividualNotification.IndividualNotificationId.class)
public class IndividualNotification {
  @Id
  String notificationId;

  @Id
  String userId;

  @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
  Boolean isRead = false;

  // @Column(nullable = false, updatable = false)
  // java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

  @Data
  @NoArgsConstructor
  @AllArgsConstructor
  public static class IndividualNotificationId implements Serializable {
    private String notificationId;
    private String userId;
  }
}
