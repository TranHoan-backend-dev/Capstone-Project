package com.capstone.device.application.business.history;

import com.capstone.device.application.dto.response.DeviceManagementHistoryProjection;
import com.capstone.device.infrastructure.persistence.DeviceManagementHistoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DeviceManagementHistoryServiceImplTest {

  @Mock
  DeviceManagementHistoryRepository repository;

  @InjectMocks
  DeviceManagementHistoryServiceImpl service;

  @Test
  void should_ReturnMappedList_When_DataExists() {
    // Arrange
    var projection1 = mock(DeviceManagementHistoryProjection.class);
    when(projection1.getEntityName()).thenReturn("ROADMAP");
    when(projection1.getItemName()).thenReturn("Roadmap A");
    LocalDateTime now = LocalDateTime.now();
    when(projection1.getOperationTime()).thenReturn(now);

    DeviceManagementHistoryProjection projection2 = mock(DeviceManagementHistoryProjection.class);
    when(projection2.getEntityName()).thenReturn("LATERAL");
    when(projection2.getItemName()).thenReturn("Lateral B");
    when(projection2.getOperationTime()).thenReturn(now.minusDays(1));

    when(repository.getDeviceManagementHistory()).thenReturn(List.of(projection1, projection2));

    // Act
    var result = service.getDeviceManagementHistory();

    // Assert
    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("ROADMAP", result.get(0).getEntityName());
    assertEquals("Roadmap A", result.get(0).getItemName());
    assertEquals(now, result.get(0).getOperationTime());

    assertEquals("LATERAL", result.get(1).getEntityName());
    assertEquals("Lateral B", result.get(1).getItemName());
    assertEquals(now.minusDays(1), result.get(1).getOperationTime());

    verify(repository, times(1)).getDeviceManagementHistory();
  }

  @Test
  void should_ReturnEmptyList_When_NoDataFound() {
    // Arrange
    when(repository.getDeviceManagementHistory()).thenReturn(Collections.emptyList());

    // Act
    var result = service.getDeviceManagementHistory();

    // Assert
    assertNotNull(result);
    assertTrue(result.isEmpty());
    verify(repository, times(1)).getDeviceManagementHistory();
  }

  @Test
  void should_HandleNullFields_When_ProjectionContainsNulls() {
    // Arrange
    DeviceManagementHistoryProjection projection = mock(DeviceManagementHistoryProjection.class);
    when(projection.getEntityName()).thenReturn(null);
    when(projection.getItemName()).thenReturn(null);
    when(projection.getOperationTime()).thenReturn(null);

    when(repository.getDeviceManagementHistory()).thenReturn(List.of(projection));

    // Act
    var result = service.getDeviceManagementHistory();

    // Assert
    assertNotNull(result);
    assertEquals(1, result.size());
    assertNull(result.get(0).getEntityName());
    assertNull(result.get(0).getItemName());
    assertNull(result.get(0).getOperationTime());

    verify(repository, times(1)).getDeviceManagementHistory();
  }
}
