package com.capstone.construction.application.business.receipt;

import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.Receipt;
import com.capstone.construction.domain.model.utils.significance.CostEstimateSignificance;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.ReceiptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReceiptServiceImplTest {

  @Mock
  ReceiptRepository receiptRepo;
  @Mock
  InstallationFormRepository ifRepo;
  @Mock
  CostEstimateRepository ceRepo;

  @InjectMocks
  ReceiptServiceImpl receiptService;

  private InstallationForm form;
  private CreateRequest createRequest;
  private InstallationFormId formId;

  @BeforeEach
  void setUp() {
    formId = new InstallationFormId(1L, 1001L);
    form = new InstallationForm();
    form.setCustomerName("Customer Name");
    form.setAddress("Customer Address");
    ReflectionTestUtils.setField(form, "id", formId);

    // CreateRequest(formCode, formNumber, receiptNumber, paymentReason, totalMoneyInDigit, totalMoneyInCharacters, attach, paymentDate, isPaid, significanceOfReceiptCreator)
    createRequest = new CreateRequest(
      1L, 1001L, "BL001",
      "Payment Reason", "1000", "One Thousand", "http://attach",
      LocalDate.now(), true, "http://creator-sign"
    );
  }

  @Test
  @DisplayName("Create receipt successfully")
  void should_CreateReceipt_When_Valid() {
    when(ifRepo.findById(formId)).thenReturn(Optional.of(form));
    when(receiptRepo.existsById(formId)).thenReturn(false);

    var estimate = new CostEstimate();
    var significance = new CostEstimateSignificance();
    significance.setSurveyStaff("S");
    significance.setPlanningTechnicalHead("P");
    significance.setCompanyLeaderShip("C");
    estimate.setSignificance(significance);

    when(ceRepo.findByInstallationForm(form)).thenReturn(Optional.of(estimate));
    when(receiptRepo.save(any())).thenAnswer(i -> {
        Receipt r = i.getArgument(0);
        ReflectionTestUtils.setField(r, "installationFormId", formId);
        return r;
    });

    var response = receiptService.createReceipt(createRequest);

    assertThat(response).isNotNull();
    assertThat(response.receiptNumber()).isEqualTo("BL001");
    verify(receiptRepo).save(any());
  }

  @Test
  @DisplayName("Create receipt should throw when form not found")
  void should_ThrowException_When_FormNotFound() {
    when(ifRepo.findById(formId)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> receiptService.createReceipt(createRequest))
        .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  @DisplayName("Create receipt should throw when receipt already exists")
  void should_ThrowException_When_ReceiptExists() {
    when(ifRepo.findById(formId)).thenReturn(Optional.of(form));
    when(receiptRepo.existsById(formId)).thenReturn(true);

    assertThatThrownBy(() -> receiptService.createReceipt(createRequest))
        .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  @DisplayName("Create receipt should throw when estimate not found")
  void should_ThrowException_When_EstimateNotFound() {
    when(ifRepo.findById(formId)).thenReturn(Optional.of(form));
    when(receiptRepo.existsById(formId)).thenReturn(false);
    when(ceRepo.findByInstallationForm(form)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> receiptService.createReceipt(createRequest))
        .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  @DisplayName("Create receipt should throw when estimate not fully signed")
  void should_ThrowException_When_EstimateNotSigned() {
    when(ifRepo.findById(formId)).thenReturn(Optional.of(form));
    when(receiptRepo.existsById(formId)).thenReturn(false);

    var estimate = new CostEstimate();
    estimate.setSignificance(new CostEstimateSignificance()); // All blank

    when(ceRepo.findByInstallationForm(form)).thenReturn(Optional.of(estimate));

    assertThatThrownBy(() -> receiptService.createReceipt(createRequest))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("ký duyệt đầy đủ");
  }

  @Test
  @DisplayName("Update receipt successfully")
  void should_UpdateReceipt_Fully() {
    // UpdateRequest(formCode, formNumber, receiptNumber, customerName, address, paymentDate, isPaid, significanceOfTreasurer)
    var update = new UpdateRequest(1L, 1001L, "NEW-BL", "New Name", "New Addr", LocalDate.now(), false, "http://treasurer-sign");
    var receipt = new Receipt();
    ReflectionTestUtils.setField(receipt, "installationForm", form);
    ReflectionTestUtils.setField(receipt, "installationFormId", formId);

    when(receiptRepo.findById(formId)).thenReturn(Optional.of(receipt));
    when(receiptRepo.save(any())).thenReturn(receipt);

    var response = receiptService.updateReceipt(update);

    assertThat(response.receiptNumber()).isEqualTo("NEW-BL");
    assertThat(response.customerName()).isEqualTo("New Name");
    verify(receiptRepo).save(any());
  }

  @Test
  @DisplayName("Delete receipt successfully")
  void should_Delete_When_Exists() {
    when(receiptRepo.existsById(formId)).thenReturn(true);

    receiptService.deleteReceipt(1L, 1001L);

    verify(receiptRepo).deleteById(formId);
  }

  @Test
  @DisplayName("Get receipt successfully")
  void should_Get_When_Exists() {
    var receipt = new Receipt();
    ReflectionTestUtils.setField(receipt, "installationFormId", formId);
    receipt.setReceiptNumber("BL123");

    when(receiptRepo.findById(formId)).thenReturn(Optional.of(receipt));

    var response = receiptService.getReceipt(1L, 1001L);
    assertThat(response.receiptNumber()).isEqualTo("BL123");
  }
}
