package com.capstone.device.application.usecase;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.business.parameter.ParameterService;
import com.capstone.device.application.dto.response.ParameterResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ParameterUseCase {
  ParameterService parameterService;
  @NonFinal
  Logger log;

  public Page<ParameterResponse> getParametersList(Pageable pageable, String filter) {
    return parameterService.getParameters(pageable, filter);
  }
}
