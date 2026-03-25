package com.capstone.construction.application.usecase;

import com.capstone.common.enumerate.RoleName;
import com.capstone.common.exception.ForbiddenException;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.infrastructure.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UseCaseUtils {
  private final EmployeeService empSrv;

  public String validateUserId(String userId) {
    var response = empSrv.getRoleOfEmployeeById(userId);
    var role = response.data().toString();
    if (!role.equalsIgnoreCase(RoleName.SURVEY_STAFF.name()) &&
      !role.equalsIgnoreCase(RoleName.COMPANY_LEADERSHIP.name()) &&
      !role.equalsIgnoreCase(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD.name())) {
      throw new ForbiddenException(SharedMessage.MES_23);
    }
    return role;
  }
}
