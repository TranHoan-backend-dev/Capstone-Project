package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.pages.BusinessPageService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.users.FilterUsersRequest;
import com.capstone.auth.application.dto.request.UpdateBusinessPageNamesRequest;
import com.capstone.auth.application.dto.response.EmployeeResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsersUseCaseTest {

  @Mock
  private UserService userService;

  @Mock
  private BusinessPageService bpService;

  @InjectMocks
  private UsersUseCase usersUseCase;

  @Test
  @DisplayName("Should return paginated list of employees - Success")
  void getPaginatedListOfEmployees_Success() {
    // Arrange
    var pageable = PageRequest.of(0, 10);
    var request = new FilterUsersRequest(null, null);
    Page<EmployeeResponse> expectedPage = new PageImpl<>(Collections.emptyList());

    when(userService.getAllEmployeesWithStatus(pageable, request)).thenReturn(expectedPage);

    // Act
    Page<EmployeeResponse> result = usersUseCase.getPaginatedListOfEmployees(pageable, request);

    // Assert
    assertEquals(expectedPage, result);
    verify(userService).getAllEmployeesWithStatus(pageable, request);
  }

  @Test
  @DisplayName("Should propagate service exception when getting paginated employees")
  void getPaginatedListOfEmployees_Fails() {
    var pageable = PageRequest.of(0, 10);
    var request = new FilterUsersRequest(null, null);
    when(userService.getAllEmployeesWithStatus(any(), any())).thenThrow(new RuntimeException("Service failure"));

    assertThrows(RuntimeException.class, () -> usersUseCase.getPaginatedListOfEmployees(pageable, request));
  }

  @Test
  @DisplayName("Should return list of pages by employee ID - Success")
  void getListOfPagesByEmployeeId_Success() {
    // Arrange
    var employeeId = "emp123";
    var expectedResult = List.of("Page 1", "Page 2");

    when(bpService.getPagesByEmployeeId(employeeId)).thenReturn(expectedResult);

    // Act
    var result = usersUseCase.getListOfPagesByEmployeeId(employeeId);

    // Assert
    assertEquals(expectedResult, result);
    verify(bpService).getPagesByEmployeeId(employeeId);
  }

  @Test
  @DisplayName("Should return empty list for employee with no pages")
  void getListOfPagesByEmployeeId_EmptyResult() {
    var employeeId = "emp-no-pages";
    when(bpService.getPagesByEmployeeId(employeeId)).thenReturn(Collections.emptyList());

    var result = usersUseCase.getListOfPagesByEmployeeId(employeeId);

    assertTrue(((List<?>) result).isEmpty());
  }

  @Test
  @DisplayName("Should update business pages for list of employees successfully")
  void updateBusinessPagesListOfEmployee_Success() {
    // Arrange
    var request1 = new UpdateBusinessPageNamesRequest("emp1",
        java.util.Set.of("p1", "p2"));
    var request2 = new UpdateBusinessPageNamesRequest("emp2",
        java.util.Set.of("p3"));
    var requests = List.of(request1, request2);

    // Act
    usersUseCase.updateBusinessPagesListOfEmployee(requests);

    // Assert
    verify(bpService).updatePagesOfEmployee("emp1", java.util.Set.of("p1", "p2"));
    verify(bpService).updatePagesOfEmployee("emp2", java.util.Set.of("p3"));
    verifyNoMoreInteractions(bpService);
  }

  @Test
  @DisplayName("Should handle empty list of updates gracefully")
  void updateBusinessPagesListOfEmployees_EmptyList() {
    // Arrange
    List<UpdateBusinessPageNamesRequest> requests = Collections.emptyList();

    // Act
    usersUseCase.updateBusinessPagesListOfEmployee(requests);

    // Assert
    verifyNoInteractions(bpService);
  }

  @Test
  @DisplayName("Should propagate exception when service fails")
  void updateBusinessPagesListOfEmployee_ServiceException() {
    // Arrange
    var request = new UpdateBusinessPageNamesRequest("emp1",
        java.util.Set.of("p1"));
    var requests = List.of(request);

    doThrow(new RuntimeException("Service Error")).when(bpService).updatePagesOfEmployee(anyString(), anySet());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> usersUseCase.updateBusinessPagesListOfEmployee(requests));
    verify(bpService).updatePagesOfEmployee("emp1", java.util.Set.of("p1"));
  }

  @Test
  @DisplayName("Should check if employee exists - Returns True")
  void checkIfEmployeeExists_True() {
    // Arrange
    var employeeId = "emp123";
    when(userService.isUserExists(employeeId)).thenReturn(true);

    // Act
    var result = usersUseCase.checkIfEmployeeExists(employeeId);

    // Assert
    assertTrue(result);
    verify(userService).isUserExists(employeeId);
  }

  @Test
  @DisplayName("Should check if employee exists - Returns False")
  void checkIfEmployeeExists_False() {
    var employeeId = "ghost-user";
    when(userService.isUserExists(employeeId)).thenReturn(false);

    var result = usersUseCase.checkIfEmployeeExists(employeeId);

    assertFalse(result);
  }
}
