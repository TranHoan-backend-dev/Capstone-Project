package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.IndividualNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndividualNotificationRepository
  extends JpaRepository<IndividualNotification, IndividualNotification.IndividualNotificationId> {
}
