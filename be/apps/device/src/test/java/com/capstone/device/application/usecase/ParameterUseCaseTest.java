package com.capstone.device.application.usecase;

import com.capstone.device.application.business.parameter.ParameterService;
import com.capstone.device.application.dto.response.ParameterResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ParameterUseCaseTest {

    @Mock
    private ParameterService parameterService;

    // We mock the service that IS ACTUALLY USED.
    // The class has two fields: 'service' and 'parameterService'. The code uses
    // 'service'.
    // Mockito will inject the mock into the first matching field.
    // Since both are same type, it's safer to ensure we are testing the behavior
    // correctly regardless or use manual injection if needed.
    // However, for now we rely on standard injection. If it fails, we will know.
    // Actually, let's just mock the one that is used. If both are mocked, it's
    // fine.

    @InjectMocks
    private ParameterUseCase parameterUseCase;

    @Test
    @DisplayName("should_GetParametersList_When_ValidRequest")
    void should_GetParametersList_When_ValidRequest() {
        // Given
        var pageable = Pageable.unpaged();
        var filter = "filter";
        Page<ParameterResponse> expectedPage = new PageImpl<>(Collections.<ParameterResponse>emptyList());

        // We assume 'parameterService' field is valid.
        when(parameterService.getParameters(pageable, filter)).thenReturn(expectedPage);

        // When
        Page<ParameterResponse> result = parameterUseCase.getParametersList(pageable, filter);

        // Then
        assertNotNull(result);
        assertEquals(expectedPage, result);
        verify(parameterService).getParameters(pageable, filter);
    }
}
