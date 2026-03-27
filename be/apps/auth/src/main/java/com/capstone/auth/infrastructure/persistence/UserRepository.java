package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.domain.model.Users;
import com.capstone.common.enumerate.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
  Optional<Users> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  Page<Users> findByIsEnabledTrueAndIsLockedFalse(Pageable pageable);

  Page<Users> findByUsernameContainsIgnoreCase(String username, Pageable pageable);

  Page<Users> findByIsEnabledTrueAndIsLockedFalseOrUsernameContainingIgnoreCase(String username, Pageable pageable);

  List<Users> findByRoleNameIn(List<RoleName> roleNames);

  Boolean existsByUserId(String userId);

  Users findByUsername(String name);

  List<Users> findByRole(Roles role);
}
