package com.capstone.construction.domain.model.utils;

import com.capstone.common.enumerate.ProcessingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
public class FormProcessingStatus {
  ProcessingStatus registration;
  ProcessingStatus estimate;
  ProcessingStatus contract;
  ProcessingStatus construction;
}
