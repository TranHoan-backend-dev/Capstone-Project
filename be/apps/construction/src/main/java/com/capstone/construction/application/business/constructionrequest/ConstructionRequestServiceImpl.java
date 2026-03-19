package com.capstone.construction.application.business.constructionrequest;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.domain.model.ConstructionRequest;
import com.capstone.construction.infrastructure.persistence.ConstructionRequestRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ConstructionRequestServiceImpl implements ConstructionRequestService {
  ConstructionRequestRepository repository;

  @Override
  public ConstructionRequest createPendingRequest(String employeeId, String contractId) {
    // TODO: Lấy thông tin khách hàng & hợp đồng từ các service liên quan (đảm bảo hợp đồng & khách hàng đã tồn tại)
    // Hiện tại tạm thời chỉ lưu contractId và employeeInChargeId, các field khác sẽ được bổ sung sau.
    var entity = ConstructionRequest.create(builder -> builder
      .contractId(contractId)
      .employeeInChargeId(employeeId)
    );
    return repository.save(entity);
  }

  @Override
  public ConstructionRequest updatePendingRequest(String installationFormCode) {
    // TODO: Cập nhật trạng thái / thông tin đơn chờ thi công theo nghiệp vụ cụ thể
    return repository.findById(installationFormCode)
      .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn chờ thi công"));
  }
}
