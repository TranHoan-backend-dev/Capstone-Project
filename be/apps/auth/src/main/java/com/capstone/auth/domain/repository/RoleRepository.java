package com.capstone.auth.domain.repository;

import com.capstone.auth.domain.model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Roles, String> {
    Roles findRolesByName(String roleName);
}
