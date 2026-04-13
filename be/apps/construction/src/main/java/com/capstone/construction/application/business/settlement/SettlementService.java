package com.capstone.construction.application.business.settlement;

import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.CreateSettlementRequest;
import com.capstone.construction.application.dto.request.settlement.UpdateSettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface SettlementService {
  SettlementResponse createSettlement(CreateSettlementRequest request);

  SettlementResponse updateSettlement(String id, UpdateSettlementRequest request);

  SettlementResponse getSettlementById(String id);

  PageResponse<SettlementResponse> getAllSettlements(Pageable pageable);

  PageResponse<SettlementResponse> filterSettlements(SettlementFilterRequest filterRequest, Pageable pageable);

  boolean signSettlement(String userId, String id, SignificanceRequest significance);

  boolean isExistingSettlement(String id);
}
