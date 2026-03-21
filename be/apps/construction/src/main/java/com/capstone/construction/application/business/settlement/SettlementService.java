package com.capstone.construction.application.business.settlement;

import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface SettlementService {
    SettlementResponse createSettlement(SettlementRequest request);

    SettlementResponse updateSettlement(String id, SettlementRequest request);

    SettlementResponse getSettlementById(String id);

    PageResponse<SettlementResponse> getAllSettlements(Pageable pageable);

    PageResponse<SettlementResponse> filterSettlements(SettlementFilterRequest filterRequest, Pageable pageable);

    boolean signSettlement(SignificanceRequest request, String id);

    boolean isExistingSettlement(String id);

    SettlementResponse updateSettlementStatus(String id, String status);
}
