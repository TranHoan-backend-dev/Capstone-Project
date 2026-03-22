package com.capstone.device.application.business.parameter;

import com.capstone.device.application.dto.request.UpdateParameterRequest;
import com.capstone.device.application.dto.response.ParameterResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ParameterService {
  Page<ParameterResponse> getParameters(Pageable pageable, String filter);

  ParameterResponse updateParameter(String updatorId, String id, UpdateParameterRequest request);

  ParameterResponse getParameterById(String id);
}
