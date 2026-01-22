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
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

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

  @Column(unique = true, nullable = false)
  String username;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_id")
  Roles role;

  @Column(nullable = false)
  String jobId;

  @Column(nullable = false)
  List<String> notificationIds;

  @Column(nullable = false)
  List<String> businessPageIds;

  @Column(nullable = false)
  String departmentId;

  @Column(nullable = false)
  String waterSupplyNetworkId; // mang luoi cap nuoc

  @Setter
  @Transient
  Collection<? extends GrantedAuthority> authorities;

  public void setEmail(String email) {
    requireNonNullAndNotEmpty(email, Constant.PT_03);
    if (!email.matches(Constant.EMAIL_PATTERN)) {
      throw new IllegalArgumentException(Constant.PT_01);
    }
    this.email = email;
  }

  public void setPassword(String password) {
    requireNonNullAndNotEmpty(password, Constant.PT_04);
    this.password = password;
  }

  public void setUsername(String username) {
    requireNonNullAndNotEmpty(username, Constant.PT_05);
    this.username = username;
  }

  public void setRole(Roles role) {
    Objects.requireNonNull(role, Constant.PT_06);
    this.role = role;
  }

  public void setNotificationIds(List<String> values) {
    Objects.requireNonNull(values, Constant.PT_22);
    this.notificationIds = values;
  }

  public void setJobId(String value) {
    requireNonNullAndNotEmpty(value, Constant.PT_20);
    this.jobId = value;
  }

  public void setBusinessPageIds(List<String> values) {
    Objects.requireNonNull(values, Constant.PT_21);
    this.businessPageIds = values;
  }

  public void setDepartmentId(String departmentId) {
    requireNonNullAndNotEmpty(departmentId, Constant.PT_19);
    this.departmentId = departmentId;
  }

  public void setWaterSupplyNetworkId(String value) {
    requireNonNullAndNotEmpty(value, Constant.PT_18);
    this.waterSupplyNetworkId = value;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
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

  public static Users create(@NonNull Consumer<UsersBuilder> builder) {
    var instance = new UsersBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class UsersBuilder {
    private String email;
    private String password;
    private String username;
    private Roles role;
    private String waterSupplyNetworkId;
    private String departmentId;

    public UsersBuilder email(String email) {
      this.email = email;
      return this;
    }

    public UsersBuilder password(String password) {
      this.password = password;
      return this;
    }

    public UsersBuilder username(String username) {
      this.username = username;
      return this;
    }

    public UsersBuilder role(Roles role) {
      this.role = role;
      return this;
    }

    public UsersBuilder waterSupplyNetworkId(String waterSupplyNetworkId) {
      this.waterSupplyNetworkId = waterSupplyNetworkId;
      return this;
    }

    public UsersBuilder departmentId(String departmentId) {
      this.departmentId = departmentId;
      return this;
    }

    public Users build() {
      var user = new Users();
      user.setEmail(email);
      user.setPassword(password);
      user.setUsername(username);
      user.setRole(role);
      user.setWaterSupplyNetworkId(waterSupplyNetworkId);
      user.setDepartmentId(departmentId);
      return user;
    }
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
