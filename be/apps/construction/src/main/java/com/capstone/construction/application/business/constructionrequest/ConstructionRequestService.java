package com.capstone.construction.application.business.constructionrequest;

import com.capstone.common.request.BaseFilterRequest;
import com.capstone.construction.application.dto.response.construction.ConstructionResponse;
import com.capstone.construction.domain.model.InstallationForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ConstructionRequestService {
  ConstructionResponse createPendingRequest(String employeeId, String contractId, String formCode, String formNumber);

  void updatePendingRequest(String id, String employeeId);

  void approveTheConstruction(String id, Boolean approved);

  ConstructionResponse getById(String id);

  ConstructionResponse getByInstallationForm(InstallationForm installationForm);

  Page<ConstructionResponse> getConstructionRequestsList(Pageable pageable, BaseFilterRequest request);
}
