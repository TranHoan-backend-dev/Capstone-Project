package com.capstone.construction.domain.model.utils;

import com.capstone.common.enumerate.ProcessingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
public class FormProcessingStatus {
  @NonNull
  ProcessingStatus registration;
  @NonNull
  ProcessingStatus estimate;
  @NonNull
  ProcessingStatus contract;
  @NonNull
  ProcessingStatus construction;
}
