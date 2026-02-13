package com.capstone.construction.application.business.installationform;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.repository.InstallationFormRepository;
import com.capstone.construction.domain.repository.WaterSupplyNetworkRepository;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.service.OverallWaterMeterService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstallationFormServiceImplTest {

    @Mock
    private InstallationFormRepository ifRepo;
    @Mock
    private WaterSupplyNetworkRepository wsnRepo;
    @Mock
    private EmployeeService empSrv;
    @Mock
    private OverallWaterMeterService owmSrv;

    @InjectMocks
    private InstallationFormServiceImpl service;

    @Test
    @DisplayName("should_ReturnAll_When_NoFilterProvided")
    void should_ReturnAll_When_NoFilterProvided() {
        // Given
        var pageable = Pageable.unpaged();
        var request = new FilterFormRequest(null, null, null);

        var entity = mock(InstallationForm.class);
        when(entity.getCreatedBy()).thenReturn("user-id");
        when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());
        when(entity.getScheduleSurveyAt()).thenReturn(LocalDate.now());

        // Mock employee service response
        when(empSrv.getEmployeeNameById("user-id")).thenReturn(
                new WrapperApiResponse(200, "OK", "Employee Name", LocalDateTime.now()));

        Page<InstallationForm> page = new PageImpl<>(List.of(entity));
        when(ifRepo.findAll(pageable)).thenReturn(page);

        // When
        Page<InstallationFormListResponse> result = service.getInstallationForms(pageable, request);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(ifRepo).findAll(pageable);
        verify(ifRepo, never()).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    @DisplayName("should_ReturnFiltered_When_KeywordProvided")
    void should_ReturnFiltered_When_KeywordProvided() {
        // Given
        var pageable = Pageable.unpaged();
        var request = new FilterFormRequest("keyword", null, null);

        var entity = mock(InstallationForm.class);
        when(entity.getCreatedBy()).thenReturn("user-id");
        when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());
        when(entity.getScheduleSurveyAt()).thenReturn(LocalDate.now());

        when(empSrv.getEmployeeNameById("user-id")).thenReturn(
                new WrapperApiResponse(200, "OK", "Employee Name", LocalDateTime.now()));

        Page<InstallationForm> page = new PageImpl<>(List.of(entity));
        when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

        // When
        Page<InstallationFormListResponse> result = service.getInstallationForms(pageable, request);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(ifRepo).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    @DisplayName("should_ReturnFiltered_When_DatesProvided")
    void should_ReturnFiltered_When_DatesProvided() {
        // Given
        var pageable = Pageable.unpaged();
        var request = new FilterFormRequest(null, "2023-01-01", "2023-01-31");

        var entity = mock(InstallationForm.class);
        when(entity.getCreatedBy()).thenReturn("user-id");
        when(entity.getCreatedAt()).thenReturn(LocalDateTime.now());
        when(entity.getScheduleSurveyAt()).thenReturn(LocalDate.now());

        when(empSrv.getEmployeeNameById("user-id")).thenReturn(
                new WrapperApiResponse(200, "OK", "Employee Name", LocalDateTime.now()));

        Page<InstallationForm> page = new PageImpl<>(List.of(entity));
        when(ifRepo.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

        // When
        Page<InstallationFormListResponse> result = service.getInstallationForms(pageable, request);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(ifRepo).findAll(any(Specification.class), eq(pageable));
    }
}
