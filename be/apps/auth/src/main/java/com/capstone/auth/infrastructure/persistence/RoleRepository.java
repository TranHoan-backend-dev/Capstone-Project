package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.domain.model.Users;
import com.capstone.common.enumerate.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface RoleRepository extends JpaRepository<Roles, String> {
  Roles findRolesByName(RoleName roleName);

  RoleName findNameById(String id);

  List<Roles> findByUsers(Set<Users> users);
}
