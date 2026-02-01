package com.capstone.organization.model;

import jakarta.persistence.*;
import com.capstone.organization.config.Constant;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

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
  String pageId;

  @Column(nullable = false, unique = true)
  String name;

  @Column(nullable = false)
  Boolean activate;

  @Column(nullable = false)
  String creator;

  @Column(nullable = false)
  String updator;

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

  private void requireNonNullAndNotEmpty(String value, String message) {
    Objects.requireNonNull(value, message);
    if (value.trim().isEmpty()) {
      throw new IllegalArgumentException(message);
    }
  }

  public static BusinessPage create(@NonNull Consumer<BusinessPageBuilder> builder) {
    var instance = new BusinessPageBuilder();
    builder.accept(instance);
    return instance.build();
  }

  public static class BusinessPageBuilder {
    private Boolean activate;
    private String creator;
    private String updator;
    private String name;

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

    public BusinessPage build() {
      var page = new BusinessPage();
      page.setActivate(activate);
      page.setCreator(creator);
      page.setUpdator(updator);
      page.setName(name);
      return page;
    }
  }
}
