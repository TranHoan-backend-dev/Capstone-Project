package com.capstone.auth.domain.model;

import com.capstone.auth.domain.model.enumerate.RoleName;
import com.capstone.auth.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Objects;
import java.util.Set;

@Table
@Getter
@Entity
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
    columnDefinition = """
      VARCHAR(255) CHECK(name in (
        'IT_DEPARTMENT', 'PLANNING_TECHNICAL_DEPARTMENT', 'CONSTRUCTION_DEPARTMENT',
        SALES_DEPARTMENT, FINANCE_DEPARTMENT
      ))
      """
  )
  private String name;

  @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  Set<Users> users;

  public void setName(String name) {
    Objects.requireNonNull(name, Constant.PT_07); // Nullpointer Exception
    RoleName.valueOf(name);
    this.name = name;
  }

  public void setUsers(Set<Users> users) {
    Objects.requireNonNull(users, Constant.PT_08);
    this.users = users;
  }

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

  public static @NonNull Roles builder(String name) {
    var role = new Roles();
    role.setName(name);
    return role;
  }
}
