package com.capstone.auth.domain.repository;

import com.capstone.auth.domain.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
  Optional<Users> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);
}
