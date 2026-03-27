package com.capstone.construction.application.business.installationform;

import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.application.dto.response.installationform.ReviewedInstallationFormsResponse;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InstallationFormService {
  NewInstallationFormResponse createNewInstallationForm(String userId, NewOrderRequest request);

  boolean isInstallationFormExisting(String formNumber, String formCode);

  Page<InstallationFormListResponse> getInstallationForms(Pageable pageable, BaseFilterRequest request);

  Page<InstallationFormListResponse> getConstructionRequestsList(Pageable pageable, BaseFilterRequest request);

  void approveInstallationForm(String userId, ApproveRequest request);

  InstallationFormListResponse getByFormCodeAndFormNumber(String formCode, String formNumber);

  Boolean checkAnyFormsBelongedToNetwork(String id);

  Page<InstallationFormListResponse> findByEstimateStatus_Pending(Pageable pageable);

  Page<InstallationFormListResponse> findByRegistrationStatus_Pending(Pageable pageable);

  ReviewedInstallationFormsResponse getReviewedInstallationFormsList();

  Page<InstallationFormListResponse> findByHandoverByIsNotNull(Pageable pageable);

  /**
   * Update contract status to APPROVED for an installation form
   * @param formCode form code of the installation form
   * @param formNumber form number of the installation form
   */
  void updateContractStatus(String formCode, String formNumber);

  /**
   *
   * @param id
   * @param installationFormId
   * @param status neu true thi la giao cho nv khao sat, false => doi truong doi thi cong
   */
  void assignInstallationForm(String id, InstallationFormId installationFormId, Boolean status);
}
