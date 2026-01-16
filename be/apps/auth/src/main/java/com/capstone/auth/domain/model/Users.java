package com.capstone.auth.domain.model;

import com.capstone.auth.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Objects;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Users implements UserDetails, Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "user_id")
  String id;

  @Column(unique = true, nullable = false)
  String email;

  @Column(nullable = false)
  String password;

  @Column(name = "employee_code", unique = true)
  String username;

  @Column(name = "created_date", nullable = false)
  LocalDateTime createdAt;

  @Column(name = "updated_date", nullable = false)
  LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_id", referencedColumnName = "role_id")
  Roles role;

  String departmentId;
  String branchId; // mang luoi cap nuoc

  @Setter
  @Transient
  Collection<? extends GrantedAuthority> authorities;

  public void setEmail(String email) {
    Objects.requireNonNull(email, Constant.PT_03);
    if (!email.matches(Constant.EMAIL_PATTERN)) {
      throw new IllegalArgumentException(Constant.PT_01);
    }
    this.email = email;
  }

  public void setPassword(String password) {
    Objects.requireNonNull(password, Constant.PT_04);
    this.password = password;
  }

  public void setUsername(String username) {
    Objects.requireNonNull(email, Constant.PT_05);
    this.username = username;
  }

  public void setRole(Roles role) {
    Objects.requireNonNull(role, Constant.PT_06);
    this.role = role;
  }

  public LocalDateTime touch() {
    return LocalDateTime.now();
  }

  public void setBranchId(String branchId) {
    Objects.requireNonNull(branchId, Constant.PT_18);
    this.branchId = branchId;
  }

  public void setDepartmentId(String departmentId) {
    Objects.requireNonNull(departmentId, Constant.PT_19);
    this.departmentId = departmentId;
  }

  @Override
  public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  @Override
  public boolean isEnabled() {
    return UserDetails.super.isEnabled();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return UserDetails.super.isCredentialsNonExpired();
  }

  @Override
  public boolean isAccountNonLocked() {
    return UserDetails.super.isAccountNonLocked();
  }

  @Override
  public boolean isAccountNonExpired() {
    return UserDetails.super.isAccountNonExpired();
  }

  public static @NonNull Users builder(
    String email, String password, String username, Roles role,
    String branchId, String departmentId
  ) {
    var user = new Users();
    user.setEmail(email);
    user.setPassword(password);
    user.setUsername(username);
    user.setRole(role);
    user.setBranchId(branchId);
    user.setDepartmentId(departmentId);
    return user;
  }

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
