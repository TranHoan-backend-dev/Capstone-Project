package com.capstone.construction.application.business.constructionrequest;

import com.capstone.construction.domain.model.ConstructionRequest;

public interface ConstructionRequestService {
  ConstructionRequest createPendingRequest(String employeeId, String contractId);

  ConstructionRequest updatePendingRequest(String installationFormCode);
}
