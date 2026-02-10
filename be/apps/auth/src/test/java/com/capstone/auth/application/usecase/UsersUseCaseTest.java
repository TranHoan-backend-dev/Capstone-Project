package com.capstone.auth.application.usecase;

import com.capstone.auth.application.business.pages.BusinessPageService;
import com.capstone.auth.application.business.users.UserService;
import com.capstone.auth.application.dto.request.FilterUsersRequest;
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
  @DisplayName("Should return paginated list of employees")
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
  @DisplayName("Should return list of pages by employee ID")
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
}
