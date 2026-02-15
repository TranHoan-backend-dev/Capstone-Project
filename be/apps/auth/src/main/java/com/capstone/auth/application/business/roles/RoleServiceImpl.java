package com.capstone.auth.application.business.roles;

import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.enumerate.RoleName;
import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.infrastructure.persistence.RoleRepository;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.common.annotation.AppLog;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements RoleService {
  RoleRepository repo;
  @NonFinal
  Logger log;

  @Override
  public String getRoleNameById(String id) {
    log.info("Getting role name by id: {}", id);

    if (repo.existsById(id)) {
      var roleName = repo.findNameById(id);
      return roleName.name();
    }
    throw new NotExistingException(Constant.SE_08);
  }

  @Override
  public Roles getRoleById(String id) {
    log.info("Getting role by id: {}", id);
    return repo.findById(id).orElseThrow(() -> new NotExistingException(Constant.SE_08));
  }

  @Override
  public Roles getRoleByName(RoleName name) {
    log.info("Getting role by name: {}", name);
    return repo.findRolesByName(name);
  }
}
