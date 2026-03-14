package com.capstone.device.application.business.parameter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.UpdateParameterRequest;
import com.capstone.device.application.dto.response.ParameterResponse;
import com.capstone.device.domain.model.Parameters;
import com.capstone.device.infrastructure.persistence.ParameterRepository;
import com.capstone.device.infrastructure.service.EmployeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ParameterServiceImpl implements ParameterService {
  @NonFinal
  Logger log;
  ParameterRepository repository;
  EmployeeService employeeService;

  @Override
  public Page<ParameterResponse> getParameters(Pageable pageable, String filter) {
    log.info("Get parameters for {}", filter);
    Page<Parameters> result;
    if (filter != null && !filter.isEmpty()) {
      if (Utils.isUUID(filter)) {
        result = repository.findAllByCreatorOrUpdator(filter, filter, pageable);
      } else {
        result = repository.findAllByNameContainingIgnoreCase(filter, pageable);
      }
    } else {
      result = repository.findAll(pageable);
    }

    var content = result.getContent();
    var response = content.stream().map(this::convertParameters).toList();
    return new PageImpl<>(response, pageable, result.getTotalElements());
  }

  @Override
  @Transactional
  public ParameterResponse updateParameter(String id, @NonNull UpdateParameterRequest request) {
    log.info("Updating parameter id: {} with value: {}", id, request.value());
    var param = repository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tham số với ID: " + id));

    var employeeResponse = employeeService.checkAuthorExisting(request.updatorId());
    if (employeeResponse == null || employeeResponse.data() == null
        || !Boolean.parseBoolean(employeeResponse.data().toString())) {
      throw new IllegalArgumentException("Nhân viên này không tồn tại");
    }
    param.setUpdator(request.updatorId());

    param.setName(request.name());
    param.setValue(request.value());

    var savedParam = repository.save(param);
    return convertParameters(savedParam);
  }

  @Override
  public ParameterResponse getParameterById(String id) {
    var param = repository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tham số với ID: " + id));
    return convertParameters(param);
  }

  private @NonNull ParameterResponse convertParameters(@NonNull Parameters parameters) {
    var creatorName = employeeService.getEmployeeName(parameters.getCreator());
    var updatorName = employeeService.getEmployeeName(parameters.getUpdator());
    return new ParameterResponse(
        parameters.getParamId(),
        parameters.getName(),
        parameters.getValue().toString(),
        creatorName.data() != null ? creatorName.data().toString() : parameters.getCreator(),
        updatorName.data() != null ? updatorName.data().toString() : parameters.getUpdator(),
        parameters.getCreatedAt().toString(),
        parameters.getUpdatedAt().toString());
  }
}
