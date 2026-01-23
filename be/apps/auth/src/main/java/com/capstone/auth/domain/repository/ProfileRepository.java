package com.capstone.auth.domain.repository;

import com.capstone.auth.domain.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {
  Optional<Profile> findByUsersEmail(String value);

  Optional<Profile> findByUsersUsername(String value);
}
