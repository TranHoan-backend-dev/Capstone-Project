package com.capstone.auth.domain.model;

import com.capstone.auth.domain.model.id.EmployeeJobId;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployeeJob {
  @EmbeddedId
  EmployeeJobId id;

  @ManyToOne(fetch = FetchType.EAGER)
  @MapsId("emp_id")
  Users users;
}
