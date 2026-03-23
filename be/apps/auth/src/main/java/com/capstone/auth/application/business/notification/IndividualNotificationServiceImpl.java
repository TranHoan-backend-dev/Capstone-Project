package com.capstone.auth.application.business.notification;

import com.capstone.auth.application.dto.response.NotificationResponse;
import com.capstone.auth.infrastructure.persistence.IndividualNotificationRepository;
import com.capstone.common.annotation.AppLog;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IndividualNotificationServiceImpl implements IndividualNotificationService {
  IndividualNotificationRepository repo;
  @NonFinal
  Logger log;

  @Override
  public List<NotificationResponse> getNotificationIdsByAccount(String id, Pageable pageable) {
    log.info("getNotificationIdsByAccount");
    var response = repo.findAllByUserId(id, pageable);
    List<NotificationResponse> result = new ArrayList<>();
    if (response != null) {
      response.forEach(notificationResponse ->
        result.add(new NotificationResponse(
          notificationResponse.getNotificationId(),
          notificationResponse.getIsRead()
        )));
    }
    return result;
  }
}
