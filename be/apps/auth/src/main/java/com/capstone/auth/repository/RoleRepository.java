package com.capstone.auth.repository;

import com.capstone.auth.model.Roles;
import com.capstone.auth.model.enumerate.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Roles, String> {
    Roles findRolesByName(String roleName);
}
