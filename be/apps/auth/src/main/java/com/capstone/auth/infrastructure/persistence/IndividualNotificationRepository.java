package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.IndividualNotification;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndividualNotificationRepository
  extends JpaRepository<IndividualNotification, IndividualNotification.IndividualNotificationId> {
  void deleteByUserId(String userId);

  @Query("""
    SELECT i FROM IndividualNotification i WHERE i.userId=:id
    """)
  List<IndividualNotification> findAllByUserId(@Param("id") String userId, Pageable pageable);

  long countByUserIdAndIsReadFalse(String userId);

  void deleteByUserIdAndNotificationId(String userId, String notificationId);
}
