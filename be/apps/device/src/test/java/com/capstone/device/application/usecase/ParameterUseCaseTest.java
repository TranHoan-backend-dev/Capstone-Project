package com.capstone.device.application.usecase;

import com.capstone.device.application.business.parameter.ParameterService;
import com.capstone.device.application.dto.response.ParameterResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ParameterUseCaseTest {

  @Mock
  private ParameterService parameterService;

  @InjectMocks
  private ParameterUseCase parameterUseCase;

  @Test
  @DisplayName("should_GetParametersList_When_ValidRequest")
  void should_GetParametersList_When_ValidRequest() {
    // Given
    var pageable = Pageable.unpaged();
    var filter = "type_filter";
    var expectedPage = new PageImpl<ParameterResponse>(Collections.emptyList());

    when(parameterService.getParameters(pageable, filter)).thenReturn(expectedPage);

    // When
    var result = parameterUseCase.getParametersList(pageable, filter);

    // Then
    assertNotNull(result);
    assertEquals(expectedPage, result);
    verify(parameterService).getParameters(pageable, filter);
  }
}
