package com.capstone.construction.application.usecase;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.construction.application.business.installationform.InstallationFormService;
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
import java.time.OffsetDateTime;
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
    var request = new InstallationFormFilterRequest();
    request.setKeyword("keyword");
    var responseItem = mock(InstallationFormListResponse.class);
    var expectedPage = new PageImpl<>(List.of(responseItem));

    when(ifSrv.getInstallationForms(pageable, request)).thenReturn(expectedPage);

    var actualPage = useCase.getPaginatedInstallationForms(pageable, request);

    assertThat(actualPage).isNotNull();
    assertThat(actualPage.getTotalElements()).isEqualTo(1);
    verify(ifSrv).getInstallationForms(pageable, request);
  }

  @Test
  @DisplayName("Should return pending estimate forms")
  void should_ReturnPendingEstimateForms_When_ServiceReturnsData() {
    var pageable = PageRequest.of(0, 10);
    var responseItem = mock(InstallationFormListResponse.class);
    var expectedPage = new PageImpl<>(List.of(responseItem));

    when(ifSrv.findByEstimateStatusPending(pageable)).thenReturn(expectedPage);

    var actualPage = useCase.findByEstimateStatusPending(pageable);

    assertThat(actualPage).isNotNull();
    assertThat(actualPage.getContent()).hasSize(1);
    verify(ifSrv).findByEstimateStatusPending(pageable);
  }

  @Test
  @DisplayName("Should return pending registration forms")
  void should_ReturnPendingRegistrationForms_When_ServiceReturnsData() {
    var pageable = PageRequest.of(0, 10);
    var responseItem = mock(InstallationFormListResponse.class);
    var expectedPage = new PageImpl<>(List.of(responseItem));

    when(ifSrv.findByRegistrationStatusPending(pageable)).thenReturn(expectedPage);

    var actualPage = useCase.findByRegistrationStatusPending(pageable);

    assertThat(actualPage).isNotNull();
    assertThat(actualPage.getContent()).hasSize(1);
    verify(ifSrv).findByRegistrationStatusPending(pageable);
  }

  @Test
  @DisplayName("Should return reviewed installation forms")
  void should_ReturnReviewedForms_When_ServiceReturnsData() {
    var approvedList = List.of(mock(InstallationFormListResponse.class));
    var rejectedList = List.of(mock(InstallationFormListResponse.class));
    var expectedResponse = new ReviewedInstallationFormsResponse(approvedList, rejectedList);

    when(ifSrv.getReviewedInstallationFormsList()).thenReturn(expectedResponse);

    var actualResponse = useCase.getReviewedInstallationFormsList();

    assertThat(actualResponse).isNotNull();
    assertThat(actualResponse.approved()).hasSize(1);
    assertThat(actualResponse.rejected()).hasSize(1);
    verify(ifSrv).getReviewedInstallationFormsList();
  }

  @Test
  @DisplayName("Should return assigned forms")
  void should_ReturnAssignedForms_When_ServiceReturnsData() {
    var pageable = PageRequest.of(0, 10);
    var responseItem = mock(InstallationFormListResponse.class);
    var expectedPage = new PageImpl<>(List.of(responseItem));

    when(ifSrv.findByHandoverByIsNotNull(pageable)).thenReturn(expectedPage);

    var actualPage = useCase.findByHandoverByIsNotNull(pageable);

    assertThat(actualPage).isNotNull();
    assertThat(actualPage.getContent()).hasSize(1);
    verify(ifSrv).findByHandoverByIsNotNull(pageable);
  }

  @Test
  @DisplayName("Should throw exception when form already exists")
  void should_ThrowException_When_FormAlreadyExists() {
    var request = createValidNewOrderRequest();
    when(ifSrv.isInstallationFormExisting("1", "1001")).thenReturn(true);

    assertThatThrownBy(() -> useCase.createNewInstallationRequest(USER_ID, request))
      .isInstanceOf(ExistingItemException.class)
      .hasMessage(Message.PT_53);

    verify(ifSrv).isInstallationFormExisting("1", "1001");
  }

  @Test
  @DisplayName("Should create form and send event")
  void should_CreateFormAndSendEvent_When_FormIsNew() {
    var request = createValidNewOrderRequest();
    when(ifSrv.isInstallationFormExisting("1", "1001")).thenReturn(false);

    var formResponse = new NewInstallationFormResponse(
      "1", "Customer", "1001", USER_ID, LocalDateTime.now());
    when(ifSrv.createNewInstallationForm(USER_ID, request)).thenReturn(formResponse);
    when(empSrv.getEmployeeNameById(USER_ID))
      .thenReturn(new WrapperApiResponse(200, "OK", "Staff Name", OffsetDateTime.now()));

    var result = useCase.createNewInstallationRequest(USER_ID, request);

    assertThat(result).isNotNull();
    assertThat(result.formNumber()).isEqualTo("1");
    verify(messageProducer).send(eq("construction_queue.order.create"), any());
  }

  @Test
  @DisplayName("Should throw NPE when request is null")
  void should_ThrowException_When_RequestIsNull() {
    assertThatThrownBy(() -> useCase.createNewInstallationRequest(USER_ID, null))
      .isInstanceOf(NullPointerException.class);
  }

  private @NonNull NewOrderRequest createValidNewOrderRequest() {
    return new NewOrderRequest(
      "1", "1001", "Customer", "Address", "123456789012", "2020-01-01", "Loc", "0901234567",
      "TAX01", "BANK01", "LOC", com.capstone.common.enumerate.UsageTarget.INSTITUTIONAL, com.capstone.common.enumerate.CustomerType.FAMILY,
      "2024-01-01", "2024-01-05", 1, 1, new ArrayList<>(), "net1", "meter1");
  }
}
