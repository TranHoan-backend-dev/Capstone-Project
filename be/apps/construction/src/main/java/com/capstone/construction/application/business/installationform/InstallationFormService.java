package com.capstone.construction.application.business.installationform;

import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InstallationFormService {
  NewInstallationFormResponse createNewInstallationForm(NewOrderRequest request);

  boolean isInstallationFormExisting(String formNumber, String formCode);

  Page<InstallationFormListResponse> getInstallationForms(Pageable pageable, FilterFormRequest request);

  void approveAndAssignInstallationForm(ApproveRequest request);

  InstallationFormListResponse getByFormCodeAndFormNumber(String formCode, String formNumber);
}
