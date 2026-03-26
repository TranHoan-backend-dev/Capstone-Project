package com.capstone.construction.application.business.constructionrequest;

import com.capstone.construction.application.dto.response.construction.ConstructionResponse;
import com.capstone.construction.domain.model.InstallationForm;

public interface ConstructionRequestService {
  ConstructionResponse createPendingRequest(String employeeId, String contractId, String formCode, String formNumber);

  void updatePendingRequest(String id, String employeeId);

  void approveTheConstruction(String id, Boolean approved);

  ConstructionResponse getById(String id);

  ConstructionResponse getByInstallationForm(InstallationForm installationForm);
}
