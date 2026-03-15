package com.capstone.auth.application.business.pages;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.auth.domain.model.BusinessPagesOfEmployees;
import com.capstone.auth.domain.model.utils.BusinessPagesOfEmployeesId;
import com.capstone.auth.infrastructure.persistence.BusinessPagesOfEmployeeRepository;
import com.capstone.auth.infrastructure.service.OrganizationService;
import com.capstone.auth.application.business.temp.TempService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessPageServiceImplTest {

  @Mock
  private BusinessPagesOfEmployeeRepository bpRepo;

  @Mock
  private OrganizationService orgSrv;

  @Mock
  private TempService tempSrv;

  @Mock
  private Logger log;

  @InjectMocks
  private BusinessPageServiceImpl businessPageService;

  @org.junit.jupiter.api.BeforeEach
  void setUp() {
    org.springframework.test.util.ReflectionTestUtils.setField(businessPageService, "log", log);
  }

  @Test
  @DisplayName("Should return list of pages when employee has pages")
  void getPagesByEmployeeId_Success() {
    // Arrange
    var employeeId = "emp123";
    var pageId1 = "page1";
    var pageId2 = "page2";
    var expectedIds = "page1, page2";

    var bpId1 = new BusinessPagesOfEmployeesId(employeeId, pageId1);
    var bp1 = new BusinessPagesOfEmployees(bpId1, null);

    var bpId2 = new BusinessPagesOfEmployeesId(employeeId, pageId2);
    var bp2 = new BusinessPagesOfEmployees(bpId2, null);

    List<BusinessPagesOfEmployees> repoResult = List.of(bp1, bp2);
    var expectedResponse = new WrapperApiResponse(200, "Success", List.of("Page 1", "Page 2"), null);

    when(bpRepo.findByUsersUserId(employeeId)).thenReturn(repoResult);
    when(orgSrv.getPagesByIds(expectedIds)).thenReturn(expectedResponse);

    // Act
    var result = businessPageService.getPagesByEmployeeId(employeeId);

    // Assert
    assertEquals(expectedResponse.data(), result);
    verify(bpRepo).findByUsersUserId(employeeId);
    verify(orgSrv).getPagesByIds(expectedIds);
  }

  @Test
  @DisplayName("Should return empty list or handle empty result when employee has no pages")
  void getPagesByEmployeeId_Empty() {
    // Arrange
    var employeeId = "emp123";
    List<BusinessPagesOfEmployees> repoResult = Collections.emptyList();
    var expectedIds = "";
    var expectedResponse = new WrapperApiResponse(200, "Success", Collections.emptyList(), null);

    when(bpRepo.findByUsersUserId(employeeId)).thenReturn(repoResult);
    when(orgSrv.getPagesByIds(expectedIds)).thenReturn(expectedResponse);

    // Act
    var result = businessPageService.getPagesByEmployeeId(employeeId);

    // Assert
    assertEquals(expectedResponse.data(), result);
    verify(bpRepo).findByUsersUserId(employeeId);
    verify(orgSrv).getPagesByIds(expectedIds);
  }

  @Test
  @DisplayName("Should update pages for employee successfully")
  void updatePagesOfEmployee_Success() {
    // Arrange
    var employeeId = "emp123";
    Set<String> pageIds = Set.of("page1", "page2");

    // Act
    businessPageService.updatePagesOfEmployee(employeeId, pageIds);

    // Assert
    verify(tempSrv).deleteTemps();
    verify(tempSrv).addNewTemps(pageIds);
    verify(bpRepo).deleteDistinctRecord(employeeId);
    verify(bpRepo).insertNewPagesForEmployee(employeeId);
  }

  @Test
  @DisplayName("Should update pages with empty set successfully (clears permissions)")
  void updatePagesOfEmployee_EmptySet() {
    // Arrange
    var employeeId = "emp123";
    Set<String> pageIds = Collections.emptySet();

    // Act
    businessPageService.updatePagesOfEmployee(employeeId, pageIds);

    // Assert
    verify(tempSrv).deleteTemps();
    verify(tempSrv).addNewTemps(pageIds);
    verify(bpRepo).deleteDistinctRecord(employeeId);
    verify(bpRepo).insertNewPagesForEmployee(employeeId);
  }

  @Test
  @DisplayName("Should propagate exception during update")
  void updatePagesOfEmployee_Exception() {
    // Arrange
    var employeeId = "emp123";
    Set<String> pageIds = Set.of("page1");
    doThrow(new RuntimeException("DB Error")).when(tempSrv).deleteTemps();

    // Act & Assert
    assertThrows(RuntimeException.class, () -> businessPageService.updatePagesOfEmployee(employeeId, pageIds));
    verify(tempSrv).deleteTemps();
    verifyNoMoreInteractions(tempSrv, bpRepo);
  }
}
