package com.capstone.construction.application.usecase.settlement;

import com.capstone.construction.application.business.settlement.SettlementService;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SettlementUseCase {
  SettlementService settlementService;

  public SettlementResponse createSettlement(SettlementRequest request) {
    return settlementService.createSettlement(request);
  }

  public SettlementResponse updateSettlement(String id, SettlementRequest request) {
    return settlementService.updateSettlement(id, request);
  }

  public void deleteSettlement(String id) {
    settlementService.deleteSettlement(id);
  }

  public SettlementResponse getSettlementById(String id) {
    return settlementService.getSettlementById(id);
  }

  public PageResponse<SettlementResponse> getAllSettlements(Pageable pageable) {
    return settlementService.getAllSettlements(pageable);
  }
}
