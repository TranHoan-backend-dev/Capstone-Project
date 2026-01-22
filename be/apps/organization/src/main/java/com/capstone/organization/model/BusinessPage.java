package com.capstone.organization.model;

import jakarta.persistence.*;
import com.capstone.organization.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;

@Table
@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BusinessPage {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  @Column(name = "page_id")
  String id;
  List<String> userIds;

  @Column(nullable = false)
  Boolean activate;

  @Column(nullable = false)
  String creator;

  @Column(nullable = false)
  String updator;

  @Column(nullable = false, unique = true)
  String name;
  String note;

  @Column(nullable = false)
  String exportAddress;
  String installtionFormCode;

  public void setUserIds(List<String> userIds) {
    this.userIds = userIds;
  }

  public void setActivate(Boolean activate) {
    Objects.requireNonNull(activate, Constant.ORG_01);
    this.activate = activate;
  }

  public void setCreator(String creator) {
    requireNonNullAndNotEmpty(creator, Constant.ORG_02);
    this.creator = creator;
  }

  public void setUpdator(String updator) {
    requireNonNullAndNotEmpty(updator, Constant.ORG_03);
    this.updator = updator;
  }

  public void setName(String name) {
    requireNonNullAndNotEmpty(name, Constant.ORG_04);
    this.name = name;
  }

  public void setNote(String note) {
    requireNonNullAndNotEmpty(note, Constant.ORG_06);
    this.note = note;
  }

  public void setExportAddress(String exportAddress) {
    requireNonNullAndNotEmpty(exportAddress, Constant.ORG_05);
    this.exportAddress = exportAddress;
  }

  public void setInstalltionFormCode(String installtionFormCode) {
    requireNonNullAndNotEmpty(installtionFormCode, Constant.ORG_07);
    this.installtionFormCode = installtionFormCode;
  }

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static BusinessPage create(Consumer<BusinessPageBuilder> builder) {
    var instance = new BusinessPageBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class BusinessPageBuilder {
    private List<String> userIds;
    private Boolean activate;
    private String creator;
    private String updator;
    private String name;
    private String note;
    private String exportAddress;
    private String installtionFormCode;

    public BusinessPageBuilder userIds(List<String> userIds) {
      this.userIds = userIds;
      return this;
    }

    public BusinessPageBuilder activate(Boolean activate) {
      this.activate = activate;
      return this;
    }

    public BusinessPageBuilder creator(String creator) {
      this.creator = creator;
      return this;
    }

    public BusinessPageBuilder updator(String updator) {
      this.updator = updator;
      return this;
    }

    public BusinessPageBuilder name(String name) {
      this.name = name;
      return this;
    }

    public BusinessPageBuilder note(String note) {
      this.note = note;
      return this;
    }

    public BusinessPageBuilder exportAddress(String exportAddress) {
      this.exportAddress = exportAddress;
      return this;
    }

    public BusinessPageBuilder installtionFormCode(String installtionFormCode) {
      this.installtionFormCode = installtionFormCode;
      return this;
    }

    public BusinessPage build() {
      var page = new BusinessPage();
      page.setUserIds(userIds);
      page.setActivate(activate);
      page.setCreator(creator);
      page.setUpdator(updator);
      page.setName(name);
      page.setNote(note);
      page.setExportAddress(exportAddress);
      page.setInstalltionFormCode(installtionFormCode);
      return page;
    }
  }
}
