package com.capstone.auth.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IndividualNotification {
  @Id
  String notificationId;

  @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
  Boolean isRead;
}
