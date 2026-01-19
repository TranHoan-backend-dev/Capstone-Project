package com.capstone.organization.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Table
@Getter
@Entity
@ToString
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Department {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;
  // TODO: setter
}
