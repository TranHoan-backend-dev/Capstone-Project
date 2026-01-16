package com.capstone.auth.domain.model;

import com.capstone.auth.infrastructure.config.Constant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Objects;

@Table
@Getter
@Entity
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Profile {
  @Id
  String id;

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
    Objects.requireNonNull(fullname, Constant.PT_10);
    if (fullname.isBlank()) {
      throw new IllegalArgumentException(Constant.PT_10);
    }
    if (!fullname.chars().allMatch(Character::isLetter)) {
      throw new IllegalArgumentException(Constant.PT_13);
    }
    this.fullname = fullname;
  }

  public void setAvatarUrl(String avatarUrl) {
    Objects.requireNonNull(avatarUrl, Constant.PT_11);
    if (avatarUrl.isBlank()) {
      throw new IllegalArgumentException(Constant.PT_11);
    }
    this.avatarUrl = avatarUrl;
  }

  public void setAddress(String address) {
    Objects.requireNonNull(address, Constant.PT_12);
    if (address.isBlank()) {
      throw new IllegalArgumentException(Constant.PT_12);
    }
    this.address = address;
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
}
