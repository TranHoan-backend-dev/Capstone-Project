package com.capstone.construction.application.business.lateral;

import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.domain.model.Lateral;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.infrastructure.persistence.LateralRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import com.capstone.construction.infrastructure.service.OverallWaterMeterService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LateralServiceImplTest {

  @Mock
  LateralRepository lateralRepository;

  @Mock
  WaterSupplyNetworkRepository networkRepository;

  @Mock
  OverallWaterMeterService metersService;

  @Mock
  Logger log;

  @InjectMocks
  LateralServiceImpl lateralService;

  @Test
  void should_CreateLateral_When_RequestIsValid() {
    // Given
    var request = new LateralRequest("Lateral Test", "network-id");
    var network = new WaterSupplyNetwork("network-id", "Network Name", LocalDateTime.now(), LocalDateTime.now());

    when(lateralRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.of(network));
    when(lateralRepository.save(any(Lateral.class))).thenAnswer(invocation -> {
      Lateral l = invocation.getArgument(0);
      ReflectionTestUtils.setField(l, "id", "lateral-id");
      ReflectionTestUtils.setField(l, "createdAt", LocalDateTime.now());
      return l;
    });

    // When
    var response = lateralService.createLateral(request);

    // Then
    assertThat(response.name()).isEqualTo("Lateral Test");
    assertThat(response.networkId()).isEqualTo("network-id");
    verify(lateralRepository).existsByNameIgnoreCase(request.name());
    verify(lateralRepository).save(any(Lateral.class));
  }

  @Test
  void should_ThrowException_When_CreateNameExists() {
    // Given
    var request = new LateralRequest("Lateral Test", "network-id");
    when(lateralRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> lateralService.createLateral(request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessageContaining("already exists");

    verify(lateralRepository, never()).save(any(Lateral.class));
  }

  @Test
  void should_ThrowException_When_CreateNetworkNotFound() {
    // Given
    var request = new LateralRequest("Lateral Test", "non-existent-network");
    when(lateralRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> lateralService.createLateral(request))
        .isExactlyInstanceOf(IllegalArgumentException.class);

    verify(lateralRepository, never()).save(any(Lateral.class));
  }

  @Test
  void should_UpdateLateral_When_RequestIsValid() {
    // Given
    var id = "lateral-id";
    var request = new LateralRequest("Lateral Updated", "new-network-id");
    var existingNetwork = new WaterSupplyNetwork("network-id", "Old Network", LocalDateTime.now(),
        LocalDateTime.now());
    var newNetwork = new WaterSupplyNetwork("new-network-id", "New Network", LocalDateTime.now(),
        LocalDateTime.now());

    var existingLateral = new Lateral(id, "Lateral Old", existingNetwork, LocalDateTime.now(), LocalDateTime.now());

    when(lateralRepository.findById(id)).thenReturn(Optional.of(existingLateral));
    when(lateralRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.of(newNetwork));
    when(lateralRepository.save(any(Lateral.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = lateralService.updateLateral(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Lateral Updated");
    assertThat(response.networkId()).isEqualTo("new-network-id");
    verify(lateralRepository).save(existingLateral);
  }

  @Test
  void should_UpdateOnlyName_When_NetworkIdIsNull() {
    // Given
    var id = "lateral-id";
    var request = new LateralRequest("Lateral Updated", null);
    var existingNetwork = new WaterSupplyNetwork("network-id", "Old Network", LocalDateTime.now(),
        LocalDateTime.now());

    var existingLateral = new Lateral(id, "Lateral Old", existingNetwork, LocalDateTime.now(), LocalDateTime.now());

    when(lateralRepository.findById(id)).thenReturn(Optional.of(existingLateral));
    when(lateralRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(lateralRepository.save(any(Lateral.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = lateralService.updateLateral(id, request);

    // Then
    assertThat(response.name()).isEqualTo("Lateral Updated");
    assertThat(response.networkId()).isEqualTo("network-id");
    verify(networkRepository, never()).findById(any());
    verify(lateralRepository).save(existingLateral);
  }

  @Test
  void should_ThrowException_When_UpdateLateralNotFound() {
    // Given
    var id = "non-existent-id";
    var request = new LateralRequest("Lateral Updated", "network-id");
    when(lateralRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> lateralService.updateLateral(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");

    verify(lateralRepository, never()).save(any());
  }

  @Test
  void should_ThrowException_When_UpdateNameAlreadyExists() {
    // Given
    var id = "lateral-id";
    var request = new LateralRequest("Lateral Existing", "network-id");
    var network = new WaterSupplyNetwork("network-id", "Network", LocalDateTime.now(), LocalDateTime.now());
    var existingLateral = new Lateral(id, "Lateral Old", network, LocalDateTime.now(), LocalDateTime.now());

    when(lateralRepository.findById(id)).thenReturn(Optional.of(existingLateral));
    when(lateralRepository.existsByNameIgnoreCase(request.name())).thenReturn(true);

    // When & Then
    assertThatThrownBy(() -> lateralService.updateLateral(id, request))
        .isInstanceOf(ExistingItemException.class)
        .hasMessageContaining("already exists");

    verify(lateralRepository, never()).save(any());
  }

  @Test
  void should_ThrowException_When_UpdateNewNetworkNotFound() {
    // Given
    var id = "lateral-id";
    var request = new LateralRequest("Lateral Updated", "non-existent-network");
    var network = new WaterSupplyNetwork("network-id", "Network", LocalDateTime.now(), LocalDateTime.now());
    var existingLateral = new Lateral(id, "Lateral Old", network, LocalDateTime.now(), LocalDateTime.now());

    when(lateralRepository.findById(id)).thenReturn(Optional.of(existingLateral));
    when(lateralRepository.existsByNameIgnoreCase(request.name())).thenReturn(false);
    when(networkRepository.findById(request.networkId())).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> lateralService.updateLateral(id, request))
        .isExactlyInstanceOf(IllegalArgumentException.class);

    verify(lateralRepository, never()).save(any());
  }

  @Test
  void should_DeleteLateral_When_IdExists() {
    // Given
    var id = "lateral-id";
    when(lateralRepository.existsById(id)).thenReturn(true);

    // When
    lateralService.deleteLateral(id);

    // Then
    verify(metersService).deleteWaterMeter(id);
    verify(lateralRepository).deleteById(id);
  }

  @Test
  void should_ThrowException_When_DeleteIdNotFound() {
    // Given
    var id = "non-existent-id";
    when(lateralRepository.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> lateralService.deleteLateral(id))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");

    verify(lateralRepository, never()).deleteById(any());
  }

  @Test
  void should_ReturnLateral_When_GetByIdFound() {
    // Given
    var id = "lateral-id";
    var network = new WaterSupplyNetwork("network-id", "Network Test", LocalDateTime.now(), LocalDateTime.now());
    var lateral = new Lateral(id, "Lateral Test", network, LocalDateTime.now(), LocalDateTime.now());

    when(lateralRepository.findById(id)).thenReturn(Optional.of(lateral));

    // When
    var response = lateralService.getLateralById(id);

    // Then
    assertThat(response.name()).isEqualTo("Lateral Test");
    assertThat(response.networkName()).isEqualTo("Network Test");
  }

  @Test
  void should_ThrowException_When_GetByIdNotFound() {
    // Given
    var id = "non-existent-id";
    when(lateralRepository.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> lateralService.getLateralById(id))
        .isExactlyInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("not found");
  }

  @Test
  void should_ReturnPage_When_GetAllLaterals() {
    // Given
    var pageable = Pageable.unpaged();
    var network = new WaterSupplyNetwork("network-id", "Network Test", LocalDateTime.now(), LocalDateTime.now());
    var lateral = new Lateral("id", "Lateral Test", network, LocalDateTime.now(), LocalDateTime.now());
    var page = new PageImpl<>(List.of(lateral));
    when(lateralRepository.findAll(pageable)).thenReturn(page);

    // When
    var result = lateralService.getAllLaterals(pageable);

    // Then
    assertThat(result.content()).hasSize(1);
    assertThat(result.content().getFirst().name()).isEqualTo("Lateral Test");
  }
}
