package com.capstone.construction.application.business.installationform;

import com.capstone.construction.application.dto.request.NewOrderRequest;

public interface InstallationFormService {
  void createNewInstallationForm(NewOrderRequest request);

  boolean isInstallationFormExisting(String formNumber);
}
