package com.capstone.auth.application.business.pages;

import com.capstone.auth.application.business.temp.TempService;
import com.capstone.auth.infrastructure.persistence.BusinessPagesOfEmployeeRepository;
import com.capstone.auth.infrastructure.service.OrganizationService;
import com.capstone.common.annotation.AppLog;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BusinessPageServiceImpl implements BusinessPageService {
  BusinessPagesOfEmployeeRepository bpRepo;
  OrganizationService orgSrv;
  TempService tempSrv;
  @NonFinal
  Logger log;

  @Override
  public Object getPagesByEmployeeId(String employeeId) {
    var result = bpRepo.findByUsersUserId(employeeId);
    log.info("Found {} pages", result.size());

    var content = result.stream()
      .map(r -> r.getId().getPageId())
      .toList();
    var string = String.join(", ", content);
    log.info("Content: {}", string);

    return orgSrv.getPagesByIds(string).data();
  }

  @Transactional
  @Override
  public void updatePagesOfEmployee(String employeeId, Set<String> pageIds) {
    log.info("Updating pages of employee with id: {}", employeeId);

    tempSrv.deleteTemps();
    tempSrv.addNewTemps(pageIds);
    bpRepo.deleteDistinctRecord(employeeId);
    bpRepo.insertNewPagesForEmployee(employeeId);
  }
}
