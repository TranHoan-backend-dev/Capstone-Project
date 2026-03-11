package com.capstone.auth.domain.model;

import com.capstone.auth.infrastructure.utils.Message;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Objects;
import java.util.function.Consumer;

@Getter
@Entity
@ToString(exclude = "role")
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Users {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String userId;

  @Column(unique = true, nullable = false)
  String email;

  @Column(unique = true, nullable = false)
  String username;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @Setter
  @Column(nullable = false)
  Boolean isEnabled;

  @Setter
  @Column(nullable = false)
  Boolean isLocked;

  @Setter
  String lockedReason;

  @Setter
  LocalDateTime lockedAt;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "role_id")
  Roles role;

  @Column(nullable = false)
  String departmentId;

  @Column(nullable = false)
  String waterSupplyNetworkId; // mang luoi cap nuoc

  String electronicSigningUrl;

  @Setter
  @Transient
  Collection<? extends GrantedAuthority> authorities;

  public void setEmail(String email) {
    requireNonNullAndNotEmpty(email, SharedMessage.MES_02);
    if (!email.matches(SharedConstant.EMAIL_PATTERN)) {
      throw new IllegalArgumentException(SharedMessage.MES_01);
    }
    this.email = email;
  }

  public void setUserId(String value) {
    requireNonNullAndNotEmpty(value, SharedMessage.MES_07);
    this.userId = value;
  }

  public void setUsername(String username) {
    requireNonNullAndNotEmpty(username, Message.PT_05);
    this.username = username;
  }

  public void setElectronicSigningUrl(String value) {
    requireNonNullAndNotEmpty(value, Message.PT_24);
    this.electronicSigningUrl = value;
  }

  public void setRole(Roles role) {
    Objects.requireNonNull(role, Message.PT_06);
    this.role = role;
  }

  public void setDepartmentId(String departmentId) {
    requireNonNullAndNotEmpty(departmentId, Message.PT_19);
    this.departmentId = departmentId;
  }

  public void setWaterSupplyNetworkId(String value) {
    requireNonNullAndNotEmpty(value, Message.PT_18);
    this.waterSupplyNetworkId = value;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public boolean isAccountNonLocked() {
    return isLocked;
  }

  public static Users create(@NonNull Consumer<UsersBuilder> builder) {
    var instance = new UsersBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class UsersBuilder {
    private final Users instance = new Users();

    public UsersBuilder email(String email) {
      instance.setEmail(email);
      return this;
    }

    public UsersBuilder userId(String id) {
      instance.setUserId(id);
      return this;
    }

    public UsersBuilder username(String username) {
      instance.setUsername(username);
      return this;
    }

    public UsersBuilder role(Roles role) {
      instance.setRole(role);
      return this;
    }

    public UsersBuilder waterSupplyNetworkId(String waterSupplyNetworkId) {
      instance.setWaterSupplyNetworkId(waterSupplyNetworkId);
      return this;
    }

    public UsersBuilder departmentId(String departmentId) {
      instance.setDepartmentId(departmentId);
      return this;
    }

    public UsersBuilder isEnabled(Boolean isEnabled) {
      instance.setIsEnabled(isEnabled);
      return this;
    }

    public UsersBuilder isLocked(Boolean isLocked) {
      instance.setIsLocked(isLocked);
      return this;
    }

    public UsersBuilder lockedReason(String lockedReason) {
      instance.setLockedReason(lockedReason);
      return this;
    }

    public UsersBuilder lockedAt(LocalDateTime lockedAt) {
      instance.setLockedAt(lockedAt);
      return this;
    }

    public UsersBuilder electronicSigningUrl(String electronicSigningUrl) {
      instance.setElectronicSigningUrl(electronicSigningUrl);
      return this;
    }

    public Users build() {
      return instance;
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
