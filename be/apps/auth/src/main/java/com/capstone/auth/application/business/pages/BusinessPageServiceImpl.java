package com.capstone.auth.application.business.pages;

import com.capstone.auth.application.business.temp.TempService;
import com.capstone.auth.domain.repository.BusinessPagesOfEmployeeRepository;
import com.capstone.auth.infrastructure.service.OrganizationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BusinessPageServiceImpl implements BusinessPageService {
  BusinessPagesOfEmployeeRepository bpRepo;
  OrganizationService orgSrv;
  TempService tempSrv;

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
