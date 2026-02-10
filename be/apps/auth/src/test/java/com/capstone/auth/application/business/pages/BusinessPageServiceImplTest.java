package com.capstone.auth.application.business.pages;

import com.capstone.auth.application.dto.response.WrapperApiResponse;
import com.capstone.auth.domain.model.BusinessPagesOfEmployees;
import com.capstone.auth.domain.model.id.BusinessPagesOfEmployeesId;
import com.capstone.auth.domain.repository.BusinessPagesOfEmployeeRepository;
import com.capstone.auth.infrastructure.service.OrganizationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessPageServiceImplTest {

  @Mock
  private BusinessPagesOfEmployeeRepository bpRepo;

  @Mock
  private OrganizationService orgSrv;

  @InjectMocks
  private BusinessPageServiceImpl businessPageService;

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
}
