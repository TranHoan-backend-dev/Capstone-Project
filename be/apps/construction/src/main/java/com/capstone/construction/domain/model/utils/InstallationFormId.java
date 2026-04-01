package com.capstone.construction.domain.model.utils;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Builder
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InstallationFormId implements Serializable {

  @Column(name = "form_code")
  private Long formCode;

  @Column(name = "form_number", length = 36)
  private Long formNumber;

  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    InstallationFormId that = (InstallationFormId) o;
    return Objects.equals(formCode, that.formCode) && Objects.equals(formNumber, that.formNumber);
  }

  @Override
  public int hashCode() {
    return Objects.hash(formCode, formNumber);
  }
}
