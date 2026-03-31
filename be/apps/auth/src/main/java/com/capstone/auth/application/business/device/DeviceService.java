package com.capstone.auth.application.business.device;

import com.capstone.auth.application.event.producer.MessageProducer;
import com.capstone.auth.application.event.producer.message.NewDeviceLoginEvent;
import com.capstone.auth.domain.model.Device;
import com.capstone.auth.infrastructure.persistence.DeviceRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DeviceService {
  DeviceRepository deviceRepo;
  MessageProducer messageProducer;

  @Value("${rabbit-mq-config.new_device_login_routing_key:new_device_login_routing_key}")
  @NonFinal
  String routingKey;

  @Value("${sending_mail.new_device_login.subject:Cảnh báo đăng nhập từ thiết bị mới}")
  @NonFinal
  String subject;

  @Value("${sending_mail.new_device_login.template:new-device-login}")
  @NonFinal
  String template;

  public void checkLoginDevice(String userId, String email, String fullName, String deviceId, String deviceInfo, String ipAddress) {
    log.info("Check login device");
    if (deviceId == null || deviceId.isEmpty()) {
      // Fallback: If no unique deviceId is sent, use deviceInfo or IP as a composite key (optional)
      // But for now, let's assume we want a real deviceId from client side for better identification.
      // If deviceId is missing, maybe we should warn anyway?
      return;
    }

    var existingDevice = deviceRepo.findByUserIdAndDeviceId(userId, deviceId);
    log.info("Existing device: {}", existingDevice);

    if (existingDevice.isEmpty()) {
      log.info("New device: {}", deviceId);
      // New device detected
      var newDevice = Device.builder()
        .userId(userId)
        .deviceId(deviceId)
        .deviceInfo(deviceInfo)
        .ipAddress(ipAddress)
        .lastLoginAt(LocalDateTime.now())
        .isKnown(true) // We auto-mark it as known because the user just logged in with correct credentials
        .build();
      deviceRepo.save(newDevice);

      // Send notification
      var loginTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy"));
      messageProducer.sendMessage(routingKey, new NewDeviceLoginEvent(
        email,
        subject,
        template,
        fullName,
        deviceInfo != null ? deviceInfo : "Không xác định",
        loginTime,
        ipAddress != null ? ipAddress : "Không xác định"
      ));
    } else {
      log.info("Old device: {}", existingDevice);
      // Update last login time
      var device = existingDevice.get();
      device.setLastLoginAt(LocalDateTime.now());
      device.setDeviceInfo(deviceInfo);
      device.setIpAddress(ipAddress);
      deviceRepo.save(device);
    }
  }
}
