package com.capstone.notification.service.impl;

import com.capstone.notification.service.boundary.NotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {
}
