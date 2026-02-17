package com.capstone.device.application.business.parameter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.domain.model.Parameters;
import com.capstone.device.infrastructure.persistence.ParameterRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ParameterServiceImpl implements ParameterService {
  @NonFinal
  Logger log;
  ParameterRepository repository;

  public Page<ParameterResponse> getParameters(Pageable pageable, String filter) {
    log.info("Get parameters for {}", filter);
    Page<Parameters> result;
    if (filter != null && !filter.isEmpty()) {
      if (Utils.isUUID(filter)) {
        result = repository.findAllByCreatorOrUpdator(pageable, filter);
      } else {
        result = repository.findAllByNameContainingIgnoreCase(filter, pageable);
      }
    } else {
      result = repository.findAll(pageable);
    }
    return result;
  }

  private ParameterResponse convertParameters(Parameters parameters) {
    return new ParameterResponse(
      parameters.getParamId(),
      parameters.getName(),
      parameters.getValue().toString(),
      parameters.getCreator(),
      parameters.getUpdator(),
      parameters.getCreatedAt().toString(),
      parameters.getUpdatedAt().toString()
    );
  }
}
