package com.capstone.organization.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Objects;

@Table
@Getter
@Entity
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BusinessPage {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "page_id")
  String id;
  List<String> userIds;

  @Column(nullable = false)
  Boolean activate;

  @Column(nullable = false)
  String creator;

  @Column(nullable = false)
  String updator;

  @Column(nullable = false, unique = true)
  String name;
  String note;

  @Column(nullable = false)
  String exportAddress;
  String installtionFormCode;

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }
  // TODO: setter
}
