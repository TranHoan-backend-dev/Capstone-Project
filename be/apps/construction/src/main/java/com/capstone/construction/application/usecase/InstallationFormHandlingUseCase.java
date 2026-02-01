package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.NewOrderRequest;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InstallationFormHandlingUseCase {
  InstallationFormService ifSrv;

  public void createNewInstallationRequest(NewOrderRequest request) {
    log.info("Creating new installation request: {}", request);

    if (ifSrv.isInstallationFormExisting(request.formNumber())) {
      ifSrv.createNewInstallationForm(request);
    }
    throw new ExistingItemException(Constant.SE_01);
  }
}
