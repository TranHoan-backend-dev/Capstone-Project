package com.capstone.device.application.business.material;

import com.capstone.device.application.dto.request.material.CreateRequest;
import com.capstone.device.application.dto.request.material.UpdateRequest;
import com.capstone.device.domain.model.Material;
import com.capstone.device.domain.model.MaterialsGroup;
import com.capstone.device.domain.model.Unit;
import com.capstone.device.infrastructure.persistence.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MaterialServiceImplTest {

  @Mock
  MaterialRepository mRepo;
  @Mock
  MaterialsGroupRepository gRepo;
  @Mock
  UnitRepository uRepo;
  @Mock
  MaterialsOfCostEstimateRepository mceRepo;
  @Mock
  MaterialsOfSettlementRepository msRepo;
  @Mock
  Logger log;

  @InjectMocks
  MaterialServiceImpl materialService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(materialService, "log", log);
  }

  @Test
  void should_CreateMaterial_When_RequestIsValid() {
    // Given
    var request = new CreateRequest(
        "AB.11111", "Đào đất",
        BigDecimal.valueOf(100000), BigDecimal.valueOf(50000),
        BigDecimal.valueOf(45000), BigDecimal.valueOf(20000),
        BigDecimal.valueOf(18000), "group-id", "unit-id");

    var group = new MaterialsGroup();
    ReflectionTestUtils.setField(group, "name", "Group Name");
    var unit = new Unit();
    ReflectionTestUtils.setField(unit, "name", "Unit Name");

    when(gRepo.findById("group-id")).thenReturn(Optional.of(group));
    when(uRepo.findById("unit-id")).thenReturn(Optional.of(unit));
    when(mRepo.save(any(Material.class))).thenAnswer(invocation -> {
      Material saved = invocation.getArgument(0);
      ReflectionTestUtils.setField(saved, "materialId", "generated-id");
      return saved;
    });

    // When
    var response = materialService.createMaterial(request);

    // Then
    assertThat(response.id()).isEqualTo("generated-id");
    assertThat(response.jobContent()).isEqualTo("Đào đất");
    assertThat(response.groupName()).isEqualTo("Group Name");
    assertThat(response.unitName()).isEqualTo("Unit Name");
    verify(mRepo).save(any(Material.class));
  }

  @Test
  void should_ThrowException_When_CreateRequestIsNull() {
    assertThatThrownBy(() -> materialService.createMaterial(null))
        .isInstanceOf(NullPointerException.class);
  }

  @Test
  void should_ThrowException_When_GroupNotFoundDuringCreation() {
    // Given
    var request = new CreateRequest(
        "LAB001", "Job",
        BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE,
        BigDecimal.ONE, BigDecimal.ONE, "not-found", "unit");
    when(gRepo.findById("not-found")).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> materialService.createMaterial(request))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Material group not found");
  }

  @Test
  void should_ThrowException_When_UnitNotFoundDuringCreation() {
    // Given
    var request = new CreateRequest(
        "LAB001", "Job",
        BigDecimal.ONE, BigDecimal.ONE, BigDecimal.ONE,
        BigDecimal.ONE, BigDecimal.ONE, "group", "not-found");
    when(gRepo.findById("group")).thenReturn(Optional.of(new MaterialsGroup()));
    when(uRepo.findById("not-found")).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> materialService.createMaterial(request))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Unit not found");
  }

  @Test
  void should_UpdateMaterial_When_MaterialExists() {
    // Given
    var id = "material-id";
    var request = new UpdateRequest(
        "Updated Job", BigDecimal.valueOf(200000), BigDecimal.valueOf(60000),
        BigDecimal.valueOf(55000), BigDecimal.valueOf(30000),
        BigDecimal.valueOf(25000), null, null);

    var material = new Material();
    ReflectionTestUtils.setField(material, "materialId", id);
    ReflectionTestUtils.setField(material, "jobContent", "Old Job");

    when(mRepo.findById(id)).thenReturn(Optional.of(material));
    when(mRepo.save(any(Material.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = materialService.updateMaterial(id, request);

    // Then
    assertThat(response.price()).isEqualTo(BigDecimal.valueOf(200000));
    verify(mRepo).save(material);
  }

  @Test
  void should_ThrowException_When_UpdateRequestIsNull() {
    assertThatThrownBy(() -> materialService.updateMaterial("id", null))
        .isInstanceOf(NullPointerException.class);
  }

  @Test
  void should_OnlyUpdateNonNullFields_When_UpdateRequestHasNulls() {
    // Given
    var id = "material-id";
    var request = new UpdateRequest(
        null, null, null, null,
        null, null, null, null);

    var material = new Material();
    ReflectionTestUtils.setField(material, "materialId", id);
    ReflectionTestUtils.setField(material, "jobContent", "Persistent Job");
    ReflectionTestUtils.setField(material, "price", BigDecimal.valueOf(100));

    when(mRepo.findById(id)).thenReturn(Optional.of(material));
    when(mRepo.save(any(Material.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    var response = materialService.updateMaterial(id, request);

    // Then
    assertThat(response.jobContent()).isEqualTo("Persistent Job");
    assertThat(response.price()).isEqualTo(BigDecimal.valueOf(100));
    verify(mRepo).save(material);
  }

  @Test
  void should_ThrowException_When_UpdatingNonExistentMaterial() {
    // Given
    var id = "not-found";
    var request = new UpdateRequest(null, null, null, null,
        null, null, null, null);
    when(mRepo.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> materialService.updateMaterial(id, request))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Material not found");
  }

  @Test
  void should_DeleteMaterial_When_Exists() {
    // Given
    var id = "material-id";
    when(mceRepo.existsByMaterial_MaterialId(id)).thenReturn(true);
    when(msRepo.existsByMaterial_MaterialId(id)).thenReturn(true);
    when(mRepo.existsById(id)).thenReturn(true);

    // When
    materialService.deleteMaterial(id);

    // Then
    verify(mceRepo).deleteByMaterial_MaterialId(id);
    verify(msRepo).deleteByMaterial_MaterialId(id);
    verify(mRepo).deleteById(id);
  }

  @Test
  void should_ThrowException_When_DeletingNonExistentMaterial() {
    // Given
    var id = "not-found";
    when(mceRepo.existsByMaterial_MaterialId(id)).thenReturn(false);
    when(msRepo.existsByMaterial_MaterialId(id)).thenReturn(false);
    when(mRepo.existsById(id)).thenReturn(false);

    // When & Then
    assertThatThrownBy(() -> materialService.deleteMaterial(id))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Material not found");
  }

  @Test
  void should_GetMaterialById_When_Exists() {
    // Given
    var id = "material-id";
    var material = new Material();
    ReflectionTestUtils.setField(material, "materialId", id);
    when(mRepo.findById(id)).thenReturn(Optional.of(material));

    // When
    var response = materialService.getMaterialById(id);

    // Then
    assertThat(response.id()).isEqualTo(id);
  }

  @Test
  void should_ThrowException_When_GettingNonExistentMaterial() {
    // Given
    var id = "not-found";
    when(mRepo.findById(id)).thenReturn(Optional.empty());

    // When & Then
    assertThatThrownBy(() -> materialService.getMaterialById(id))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Material not found");
  }

  @Test
  void should_GetAllMaterials_WithPagination() {
    // Given
    var pageable = PageRequest.of(0, 10);
    var material = new Material();
    ReflectionTestUtils.setField(material, "materialId", "id-1");
    var page = new PageImpl<>(List.of(material));

    when(mRepo.findAll(pageable)).thenReturn(page);

    // When
    var response = materialService.getAllMaterials(pageable);

    // Then
    assertThat(response.getContent()).hasSize(1);
    assertThat(response.getContent().getFirst().id()).isEqualTo("id-1");
  }

  @Test
  void should_ReturnTrue_When_MaterialExists() {
    // Given
    var id = "material-id";
    when(mRepo.existsById(id)).thenReturn(true);

    // When
    var exists = materialService.materialExists(id);

    // Then
    assertThat(exists).isTrue();
  }

  @Test
  void should_HandleNullGroupAndUnit_InMapper() {
    // Given
    var id = "material-id";
    var material = new Material();
    ReflectionTestUtils.setField(material, "materialId", id);
    ReflectionTestUtils.setField(material, "group", null);
    ReflectionTestUtils.setField(material, "unit", null);
    when(mRepo.findById(id)).thenReturn(Optional.of(material));

    // When
    var response = materialService.getMaterialById(id);

    // Then
    assertThat(response.groupName()).isNull();
    assertThat(response.unitName()).isNull();
  }
}
