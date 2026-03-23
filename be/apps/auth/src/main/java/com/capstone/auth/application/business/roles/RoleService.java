package com.capstone.auth.application.business.roles;

import com.capstone.auth.domain.model.Roles;
import com.capstone.common.enumerate.RoleName;

public interface RoleService {
  String getRoleNameById(String id);

  Roles getRoleById(String id);

  Roles getRoleByName(RoleName name);
}
