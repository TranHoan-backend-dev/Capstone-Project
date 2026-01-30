package com.capstone.auth.domain.model;

import com.capstone.auth.domain.model.id.BusinessPagesOfEmployeesId;
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
public class BusinessPagesOfEmployees {
  @EmbeddedId
  BusinessPagesOfEmployeesId id;

  @ManyToOne(fetch = FetchType.EAGER)
  @MapsId("empId")
  Users users;
}
