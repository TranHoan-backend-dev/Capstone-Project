package com.capstone.auth.application.business.roles;

import com.capstone.auth.domain.model.Roles;

public interface RoleService {
  String getRoleNameById(String id);

  Roles getRoleById(String id);
}
