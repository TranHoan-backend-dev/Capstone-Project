package com.capstone.customer.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Table
@Getter
@Entity
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Bill {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  String customerId;

  @Column(nullable = false)
  String name;
  String note;

  @Column(nullable = false)
  String exportAddress;
  String installtionFormCode;
}
