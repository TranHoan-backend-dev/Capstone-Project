package com.capstone.auth.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Set;

@Table
@Getter
@Setter
@Entity
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Roles implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "role_id")
  private String id;

  @Column(
    nullable = false, unique = true,
    columnDefinition = "VARCHAR(255) CHECK(name in ('EMPLOYEE', 'ADMIN', 'CUSTOMER'))"
  )
  private String name;

  @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  Set<Users> users;

  public boolean removeUserFromRole(Users... usersList) {
    if (usersList != null && usersList.length > 0 && !users.isEmpty()) {
      Arrays.stream(usersList)
        .sequential()
        .forEach(user -> users.remove(user));
      return true;
    }
    return false;
  }

  public boolean addUserToRole(Users... usersList) {
    if (usersList != null && usersList.length > 0 && !users.isEmpty()) {
      users.addAll(Arrays.asList(usersList));
      return true;
    }
    return false;
  }
}
