package com.capstone.construction.application.usecase;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.application.event.producer.InstallationFormCreatedEvent;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.Objects;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InstallationFormHandlingUseCase {
  InstallationFormService ifSrv;
  MessageProducer messageProducer;
  @NonFinal
  Logger log;

  public Page<InstallationFormListResponse> getPaginatedInstallationForms(Pageable pageable, FilterFormRequest request) {
    log.info("UseCase is fetching grouped paginated installation forms");
    return ifSrv.getInstallationForms(pageable, request);
  }

  public NewInstallationFormResponse createNewInstallationRequest(@NonNull NewOrderRequest request) {
    log.info("UseCase is processing new installation request for form number: {}", request.formNumber());

    if (ifSrv.isInstallationFormExisting(request.formNumber(), request.formCode())) {
      log.warn("Installation form already exists: {}", request.formNumber());
      throw new ExistingItemException(Constant.SE_01);
    }

    Objects.requireNonNull(request.numberOfHousehold(), Constant.PT_56);
    Objects.requireNonNull(request.householdRegistrationNumber(), Constant.PT_57);

    var savedResponse = ifSrv.createNewInstallationForm(request);

    // Send notification event using the DTO data
    var event = new InstallationFormCreatedEvent(
      savedResponse.formNumber(),
      savedResponse.customerName(),
      savedResponse.address(),
      savedResponse.phoneNumber(),
      savedResponse.createdAt());
    messageProducer.sendInstallationFormCreatedEvent(event);

    log.info("Installation request finished successfully for form: {}", savedResponse.formNumber());
    return savedResponse;
  }
}
