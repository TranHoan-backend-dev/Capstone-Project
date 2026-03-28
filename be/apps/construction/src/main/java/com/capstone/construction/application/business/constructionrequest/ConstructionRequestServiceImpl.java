package com.capstone.construction.application.business.constructionrequest;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.enumerate.RoleName;
import com.capstone.common.exception.NotExistingException;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.application.dto.response.construction.ConstructionResponse;
import com.capstone.construction.domain.model.ConstructionRequest;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.ConstructionRequestRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.service.CustomerService;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.utils.Message;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConstructionRequestServiceImpl implements ConstructionRequestService {
  ConstructionRequestRepository repository;
  CustomerService customerService;
  InstallationFormRepository ifRepo;
  EmployeeService employeeService;

  @Override
  public ConstructionResponse createPendingRequest(String employeeId, String contractId, String formCode, String formNumber) {
    log.info("Creating pending request");
    if (!customerService.checkExistenceOfContract(contractId)) {
      throw new IllegalArgumentException("Không tìm thấy hợp đồng");
    }

    validateEmployee(employeeId);

    var installationForm = ifRepo.findById(new InstallationFormId(formCode, formNumber))
      .orElseThrow(() -> new IllegalArgumentException(String.format(SharedMessage.MES_24, formNumber, formCode)));

    log.info("Creating pending request");
    var constructionRequest = ConstructionRequest.builder()
      .contractId(contractId)
      .installationForm(installationForm)
      .build();
    return convert(repository.save(constructionRequest));
  }

  @Override
  public void updatePendingRequest(String id, String employeeId) {
    var request = getConstructionRequest(id);

    validateEmployee(employeeId);

    var installationForm = request.getInstallationForm();
    installationForm.setConstructedBy(employeeId);
    ifRepo.save(installationForm);
  }

  @Override
  public void approveTheConstruction(String id, Boolean approved) {
    var request = getConstructionRequest(id);
    var installationForm = request.getInstallationForm();
    var status = installationForm.getStatus();
    status.setConstruction(ProcessingStatus.APPROVED);
    ifRepo.save(installationForm);
  }

  @Override
  public ConstructionResponse getById(String id) {
    var result = repository.findById(id).orElseThrow(() -> new NotExistingException("Không tìm thấy đơn thi công"));
    return convert(result);
  }

  @Override
  public ConstructionResponse getByInstallationForm(InstallationForm installationForm) {
    return convert(repository.findByInstallationForm(installationForm));
  }

  private ConstructionRequest getConstructionRequest(String id) {
    return repository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn chờ thi công"));
  }

  private void validateEmployee(String employeeId) {
    log.info("Validating employee " + employeeId);
    var status = employeeService.isEmployeeExisting(employeeId).data().toString();
    if (!Boolean.parseBoolean(status)) {
      throw new IllegalArgumentException("Không tìm thấy nhân viên với id " + employeeId);
    }
    var role = employeeService.getRoleOfEmployeeById(employeeId).data().toString();
    if (!RoleName.CONSTRUCTION_DEPARTMENT_STAFF.name().equalsIgnoreCase(role)) {
      throw new IllegalArgumentException(
        String.format(Message.PT_28, "đội trưởng đội thi công (nhân viên chi nhánh Xây lắp"));
    }
  }

  private ConstructionResponse convert(@NonNull ConstructionRequest request) {
    var installationForm = request.getInstallationForm();
    var isApproved = installationForm.getStatus().getConstruction().equals(ProcessingStatus.APPROVED);
    return ConstructionResponse.builder()
      .id(request.getId())
      .contractId(request.getContractId())
      .formCode(installationForm.getFormCode())
      .formNumber(installationForm.getFormNumber())
      .isApproved(String.valueOf(isApproved))
      .createdAt(request.getCreatedAt().toString())
      .build();
  }
}
