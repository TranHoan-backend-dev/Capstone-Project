package com.capstone.construction.domain.model.utils.significance;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Setter;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@Builder
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptSignificance implements Serializable {
  String receiptCreator = "";
  String treasurer = "";

  @JsonIgnore
  public boolean isReceiptFullySigned() {
    return !receiptCreator.isBlank() && !treasurer.isBlank();
  }
}
