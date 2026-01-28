package com.capstone.auth.domain.model;

import com.capstone.auth.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

import java.time.LocalDate;
import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Profile {
  @Id
  String profileId;

  @OneToOne(fetch = FetchType.EAGER)
  @MapsId
  @JoinColumn(name = "user_id")
  Users users;

  @Column(nullable = false)
  String fullname;
  String avatarUrl;
  String address;

  @Column(unique = true, nullable = false)
  String phoneNumber;
  Boolean gender;
  LocalDate birthday;

  public void setUsers(Users users) {
    Objects.requireNonNull(users, Constant.PT_09);
    this.users = users;
  }

  public void setFullname(String fullname) {
    requireNonNullAndNotEmpty(fullname, Constant.PT_10);
    if (!fullname.chars().allMatch(Character::isLetter)) {
      throw new IllegalArgumentException(Constant.PT_13);
    }
    this.fullname = fullname;
  }

  public void setAvatarUrl(String avatarUrl) {
    requireNonNullAndNotEmpty(avatarUrl, Constant.PT_11);
    this.avatarUrl = avatarUrl;
  }

  public void setAddress(String address) {
    requireNonNullAndNotEmpty(address, Constant.PT_12);
    this.address = address;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public void setPhoneNumber(String phoneNumber) {
    Objects.requireNonNull(phoneNumber, Constant.PT_14);
    if (phoneNumber.isBlank()) {
      throw new IllegalArgumentException(Constant.PT_15);
    }
    if (!phoneNumber.matches(Constant.PHONE_PATTERN)) {
      throw new IllegalArgumentException(Constant.PT_14);
    }
    this.phoneNumber = phoneNumber;
  }

  public void setGender(Boolean gender) {
    Objects.requireNonNull(gender, Constant.PT_16);
    this.gender = gender;
  }

  public void setBirthday(LocalDate birthday) {
    Objects.requireNonNull(birthday, Constant.PT_17);
    this.birthday = birthday;
  }

  public static Profile create(@NonNull Consumer<ProfileBuilder> consumer) {
    var builder = new ProfileBuilder();
    consumer.accept(builder);
    return builder.build();
  }

  public static class ProfileBuilder {
    private final Profile unit = new Profile();

    public ProfileBuilder address(String value) {
      unit.setAddress(value);
      return this;
    }

    public ProfileBuilder avatarUrl(String value) {
      unit.setAvatarUrl(value);
      return this;
    }

    public ProfileBuilder fullname(String value) {
      unit.setFullname(value);
      return this;
    }

    public ProfileBuilder phoneNumber(String value) {
      unit.setPhoneNumber(value);
      return this;
    }

    public ProfileBuilder gender(Boolean value) {
      unit.setGender(value);
      return this;
    }

    public ProfileBuilder birthday(LocalDate value) {
      unit.setBirthday(value);
      return this;
    }

    public ProfileBuilder users(Users value) {
      unit.setUsers(value);
      return this;
    }

    public Profile build() {
      return unit;
    }
  }
}
