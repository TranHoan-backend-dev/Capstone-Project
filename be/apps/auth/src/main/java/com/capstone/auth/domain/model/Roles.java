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
import java.util.function.Consumer;

@Table(name = "user_roles")
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

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, unique = true)
  private RoleName name;

  @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  Set<Users> users;

  public void setName(RoleName name) {
    Objects.requireNonNull(name, Constant.PT_07); // Nullpointer Exception
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

  public static Roles create(@NonNull Consumer<RolesBuilder> builder) {
    var instance = new RolesBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class RolesBuilder {
    private RoleName name;
    private Set<Users> users;

    public RolesBuilder name(RoleName name) {
      this.name = name;
      return this;
    }

    public RolesBuilder users(Set<Users> users) {
      this.users = users;
      return this;
    }

    public Roles build() {
      var role = new Roles();
      role.setName(name);
      if (users != null) {
        role.setUsers(users);
      }
      return role;
    }
  }
}
