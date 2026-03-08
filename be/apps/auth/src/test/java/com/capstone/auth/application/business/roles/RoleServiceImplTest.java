package com.capstone.auth.application.business.roles;

import com.capstone.auth.application.exception.NotExistingException;
import com.capstone.auth.domain.model.Roles;
import com.capstone.auth.infrastructure.config.Constant;
import com.capstone.auth.infrastructure.persistence.RoleRepository;
import com.capstone.common.enumerate.RoleName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoleServiceImplTest {

  @Mock
  private RoleRepository repo;

  @Mock
  private Logger log;

  @InjectMocks
  private RoleServiceImpl roleService;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(roleService, "log", log);
  }

  @Test
  @DisplayName("should_ReturnRoleName_When_IdExists")
  void should_ReturnRoleName_When_IdExists() {
    var id = "role-id";
    when(repo.existsById(id)).thenReturn(true);
    when(repo.findNameById(id)).thenReturn(RoleName.IT_STAFF);

    String result = roleService.getRoleNameById(id);

    assertEquals("IT_STAFF", result);
  }

  @Test
  @DisplayName("should_ThrowNotExistingException_When_IdNotExistsForGetName")
  void should_ThrowNotExistingException_When_IdNotExistsForGetName() {
    var id = "role-id";
    when(repo.existsById(id)).thenReturn(false);

    NotExistingException ex = assertThrows(NotExistingException.class, () -> roleService.getRoleNameById(id));
    assertEquals(Constant.SE_08, ex.getMessage());
  }

  @Test
  @DisplayName("should_ReturnRole_When_IdExists")
  void should_ReturnRole_When_IdExists() {
    var id = "role-id";
    var role = new Roles();
    role.setName(RoleName.IT_STAFF);
    when(repo.findById(id)).thenReturn(Optional.of(role));

    var result = roleService.getRoleById(id);

    assertEquals(RoleName.IT_STAFF, result.getName());
  }

  @Test
  @DisplayName("should_ThrowNotExistingException_When_IdNotExistsForGetRole")
  void should_ThrowNotExistingException_When_IdNotExistsForGetRole() {
    var id = "role-id";
    when(repo.findById(id)).thenReturn(Optional.empty());

    NotExistingException ex = assertThrows(NotExistingException.class, () -> roleService.getRoleById(id));
    assertEquals(Constant.SE_08, ex.getMessage());
  }

  @Test
  @DisplayName("should_ReturnRole_When_RoleNameExists")
  void should_ReturnRole_When_RoleNameExists() {
    var roleName = RoleName.IT_STAFF;
    var role = new Roles();
    role.setName(roleName);
    when(repo.findRolesByName(roleName)).thenReturn(role);

    var result = roleService.getRoleByName(roleName);

    assertEquals(roleName, result.getName());
    verify(repo).findRolesByName(roleName);
  }

  @Test
  @DisplayName("should_ReturnNull_When_RoleNameNotFound")
  void should_ReturnNull_When_RoleNameNotFound() {
    var roleName = RoleName.IT_STAFF;
    when(repo.findRolesByName(roleName)).thenReturn(null);

    var result = roleService.getRoleByName(roleName);

    assertNull(result);
  }
}
