package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByUserIdAndDeviceId(String userId, String deviceId);
}
