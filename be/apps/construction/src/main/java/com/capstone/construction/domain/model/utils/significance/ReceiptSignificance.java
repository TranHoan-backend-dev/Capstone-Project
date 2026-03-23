package com.capstone.construction.domain.model.utils.significance;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Builder
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptSignificance implements Serializable {
  @Builder.Default
  String receiptCreator = "";
  @Builder.Default
  String treasurer = "";

  public boolean isReceiptFullySigned() {
    return !receiptCreator.isBlank() && !treasurer.isBlank();
  }
}
