package com.capstone.construction.application.business.installationform;

import com.capstone.construction.application.dto.response.InstallationFormListResponse;
import com.capstone.construction.application.dto.request.NewOrderRequest;
import com.capstone.construction.application.dto.response.InstallationFormResponse;
import org.springframework.data.domain.Pageable;

public interface InstallationFormService {
  InstallationFormResponse createNewInstallationForm(NewOrderRequest request);

  boolean isInstallationFormExisting(String formNumber);

  InstallationFormListResponse getInstallationForms(Pageable pageable);
}
