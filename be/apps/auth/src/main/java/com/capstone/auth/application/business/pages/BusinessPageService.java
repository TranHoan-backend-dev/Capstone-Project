package com.capstone.auth.application.business.pages;

import java.util.Set;

public interface BusinessPageService {
  Object getPagesByEmployeeId(String employeeId);

  void updatePagesOfEmployee(String employeeId, Set<String> pageIds);
}
