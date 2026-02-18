package com.capstone.construction.application.business.settlement;

import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Settlement;
import com.capstone.construction.infrastructure.persistence.SettlementRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SettlementServiceImpl implements SettlementService {
  SettlementRepository settlementRepository;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public SettlementResponse createSettlement(@NonNull SettlementRequest request) {
    log.info("Creating new settlement for address: {}", request.address());

    var settlement = Settlement.create(builder -> builder
      .jobContent(request.jobContent())
      .address(request.address())
      .connectionFee(request.connectionFee())
      .note(request.note())
      .status(request.status())
      .registrationAt(request.registrationAt()));

    var saved = settlementRepository.save(settlement);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public SettlementResponse updateSettlement(String id, @NonNull SettlementRequest request) {
    log.info("Updating settlement with id: {}", id);
    var settlement = settlementRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + id));

    settlement.setJobContent(request.jobContent());
    settlement.setAddress(request.address());
    settlement.setConnectionFee(request.connectionFee());
    settlement.setNote(request.note());
    settlement.setStatus(request.status());
    settlement.setRegistrationAt(request.registrationAt());

    var saved = settlementRepository.save(settlement);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteSettlement(String id) {
    log.info("Deleting settlement with id: {}", id);
    if (!settlementRepository.existsById(id)) {
      throw new IllegalArgumentException("Settlement not found with id: " + id);
    }
    settlementRepository.deleteById(id);
  }

  @Override
  public SettlementResponse getSettlementById(String id) {
    log.info("Fetching settlement with id: {}", id);
    return settlementRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + id));
  }

  @Override
  public PageResponse<SettlementResponse> getAllSettlements(Pageable pageable) {
    log.info("Fetching all settlements with pageable: {}", pageable);
    var page = settlementRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private SettlementResponse mapToResponse(Settlement settlement) {
    return new SettlementResponse(
      settlement.getSettlementId(),
      settlement.getJobContent(),
      settlement.getAddress(),
      settlement.getConnectionFee(),
      settlement.getNote(),
      settlement.getCreatedAt(),
      settlement.getUpdatedAt(),
      settlement.getStatus(),
      settlement.getRegistrationAt());
  }
}
