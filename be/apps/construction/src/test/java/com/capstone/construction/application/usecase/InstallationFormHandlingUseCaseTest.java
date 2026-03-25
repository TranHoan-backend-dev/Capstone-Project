package com.capstone.construction.application.usecase;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.business.installationform.InstallationFormService;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.installationform.*;
import com.capstone.construction.application.dto.response.installationform.*;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.utils.Message;
import com.capstone.construction.infrastructure.service.EmployeeService;
import org.jspecify.annotations.NonNull;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstallationFormHandlingUseCaseTest {

  @Mock
  private InstallationFormService ifSrv;

  @Mock
  private MessageProducer messageProducer;

  @Mock
  private EmployeeService empSrv;

  @Mock
  private CostEstimateUseCase costEstimateUseCase;

  @InjectMocks
  private InstallationFormUseCase useCase;

  private static final String USER_ID = "EMP-001";

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(useCase, "PREFIX", ".order.");
    ReflectionTestUtils.setField(useCase, "CREATE_ACTION", "create");
    ReflectionTestUtils.setField(useCase, "ASSIGN_ACTION", "assign");
    ReflectionTestUtils.setField(useCase, "QUEUE_NAME", "construction_queue");
  }

  @Test
  @DisplayName("Should return paginated forms")
  void should_ReturnPaginatedForms_When_ServiceReturnsData() {
    var pageable = Pageable.unpaged();
    var request = new BaseFilterRequest("keyword", null, null);
    var responseItem = mock(InstallationFormListResponse.class);
    var expectedPage = new PageImpl<>(List.of(responseItem));

    when(ifSrv.getInstallationForms(pageable, request)).thenReturn(expectedPage);

    var actualPage = useCase.getPaginatedInstallationForms(pageable, request);

    assertThat(actualPage).isNotNull();
    assertThat(actualPage.getTotalElements()).isEqualTo(1);
    verify(ifSrv).getInstallationForms(pageable, request);
  }

  @Test
  @DisplayName("Should throw exception when form already exists")
  void should_ThrowException_When_FormAlreadyExists() {
    var request = createValidNewOrderRequest();
    when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(true);

    assertThatThrownBy(() -> useCase.createNewInstallationRequest(USER_ID, request))
      .isInstanceOf(ExistingItemException.class)
      .hasMessage(Message.PT_53);

    verify(ifSrv).isInstallationFormExisting("FORM-001", "CODE-001");
  }

  @Test
  @DisplayName("Should create form and send event")
  void should_CreateFormAndSendEvent_When_FormIsNew() {
    var request = createValidNewOrderRequest();
    when(ifSrv.isInstallationFormExisting("FORM-001", "CODE-001")).thenReturn(false);

    var formResponse = new NewInstallationFormResponse(
      "FORM-001", "Customer", "CODE-001", USER_ID, LocalDateTime.now());
    when(ifSrv.createNewInstallationForm(USER_ID, request)).thenReturn(formResponse);
    when(empSrv.getEmployeeNameById(USER_ID))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", LocalDateTime.now()));

    var result = useCase.createNewInstallationRequest(USER_ID, request);

    assertThat(result).isNotNull();
    assertThat(result.formNumber()).isEqualTo("FORM-001");
    verify(messageProducer).send(eq("construction_queue.order.create"), any());
  }

  @Test
  @DisplayName("Should throw NPE when request is null")
  void should_ThrowException_When_RequestIsNull() {
    assertThatThrownBy(() -> useCase.createNewInstallationRequest(USER_ID, null))
      .isInstanceOf(NullPointerException.class);
  }

  @Test
  @DisplayName("Should approve and create estimate")
  void should_ApproveAndCreateEstimate_When_StatusIsTrue() {
    var request = new ApproveRequest("F-001", "C-001", true);
    var order = mock(InstallationFormListResponse.class);
    when(order.formCode()).thenReturn("C-001");
    when(order.formNumber()).thenReturn("F-001");
    when(order.registrationAt()).thenReturn("2024-01-01T10:00:00");

    when(ifSrv.getByFormCodeAndFormNumber("C-001", "F-001")).thenReturn(order);

    useCase.approveInstallationForm(USER_ID, request);

    verify(ifSrv).approveInstallationForm(USER_ID, request);
    verify(costEstimateUseCase).createEstimate(any());
  }

  @Test
  @DisplayName("Should approve but not create estimate when status is false")
  void should_ApproveAndNotCreateEstimate_When_StatusIsFalse() {
    var request = new ApproveRequest("F-001", "C-001", false);
    var order = mock(InstallationFormListResponse.class);
    when(ifSrv.getByFormCodeAndFormNumber("C-001", "F-001")).thenReturn(order);

    useCase.approveInstallationForm(USER_ID, request);

    verify(ifSrv).approveInstallationForm(USER_ID, request);
    verify(costEstimateUseCase, never()).createEstimate(any());
  }

  private @NonNull NewOrderRequest createValidNewOrderRequest() {
    return new NewOrderRequest(
      "CODE-001", "FORM-001", "Customer", "Address", "123456789012", "2020-01-01", "Loc", "0901234567",
      "TAX01", "BANK01", "LOC", com.capstone.common.enumerate.UsageTarget.INSTITUTIONAL, com.capstone.common.enumerate.CustomerType.FAMILY,
      "2024-01-01", "2024-01-05", 1, 1, new ArrayList<>(), "net1", "meter1");
  }
}
