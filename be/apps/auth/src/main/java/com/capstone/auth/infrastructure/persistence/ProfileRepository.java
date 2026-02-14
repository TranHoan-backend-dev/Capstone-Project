package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {
  Optional<Profile> findByUsersEmail(String value);

  Optional<Profile> findByUsersUsername(String value);

  @Modifying
  @Query("""
    update Profile
    set avatarUrl = :avatarUrl
    where profileId = :id
    """)
  int updateAvatarByProfileId(@Param("id") String id, @Param("avatarUrl") String avatarUrl);
}
