package com.capstone.construction.application.business.installationform;

import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InstallationFormService {
  NewInstallationFormResponse createNewInstallationForm(NewOrderRequest request);

  boolean isInstallationFormExisting(String formNumber, String formCode);

  Page<InstallationFormListResponse> getInstallationForms(Pageable pageable, BaseFilterRequest request);

  Page<InstallationFormListResponse> getConstructionRequestsList(Pageable pageable, BaseFilterRequest request);

  void approveAndAssignInstallationForm(ApproveRequest request);

  InstallationFormListResponse getByFormCodeAndFormNumber(String formCode, String formNumber);

  Boolean checkFormBelongedToNetwork(String id);
}
