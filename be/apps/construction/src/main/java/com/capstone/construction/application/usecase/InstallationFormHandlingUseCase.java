package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.InstallationFormResponse;
import com.capstone.construction.application.event.producer.InstallationFormCreatedEvent;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InstallationFormHandlingUseCase {
  InstallationFormService ifSrv;
  MessageProducer messageProducer;

  public Page<InstallationFormListResponse> getPaginatedInstallationForms(Pageable pageable, FilterFormRequest request) {
    log.info("UseCase is fetching grouped paginated installation forms");
    return ifSrv.getInstallationForms(pageable, request);
  }

  public InstallationFormResponse createNewInstallationRequest(@NonNull NewOrderRequest request) {
    log.info("UseCase is processing new installation request for form number: {}", request.formNumber());

    if (ifSrv.isInstallationFormExisting(request.formNumber())) {
      log.warn("Installation form already exists: {}", request.formNumber());
      throw new ExistingItemException(Constant.SE_01);
    }

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
