package com.capstone.construction.application.business.receipt;

import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.Receipt;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.domain.model.utils.Significance;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.ReceiptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReceiptServiceImplTest {

    @Mock ReceiptRepository receiptRepo;
    @Mock InstallationFormRepository ifRepo;
    @Mock CostEstimateRepository ceRepo;

    @InjectMocks ReceiptServiceImpl receiptService;

    InstallationForm form;
    CreateRequest createRequest;
    InstallationFormId formId;

    @BeforeEach
    void setUp() {
        formId = new InstallationFormId("LD", "2024001");
        form = new InstallationForm();
        form.setId(formId);
        
        createRequest = new CreateRequest(
                "LD", "2024001", "BL001", "Customer", "Address", LocalDate.now(), true
        );
    }

    @Test
    void should_CreateReceipt_When_Valid() {
        when(ifRepo.findById(formId)).thenReturn(Optional.of(form));
        when(receiptRepo.existsById(formId)).thenReturn(false);
        
        CostEstimate estimate = new CostEstimate();
        Significance significance = new Significance();
        significance.setSurveyStaff("S");
        significance.setPlanningTechnicalHead("P");
        significance.setCompanyLeaderShip("C");
        estimate.setSignificance(significance);
        
        when(ceRepo.findByInstallationForm(form)).thenReturn(Optional.of(estimate));
        when(receiptRepo.save(any())).thenAnswer(i -> i.getArguments()[0]);

        var response = receiptService.createReceipt(createRequest);
        
        assertNotNull(response);
        assertEquals("BL001", response.receiptNumber());
        verify(receiptRepo).save(any());
    }

    @Test
    void should_ThrowException_When_FormNotFound() {
        when(ifRepo.findById(formId)).thenReturn(Optional.empty());
        
        assertThrows(IllegalArgumentException.class, () -> receiptService.createReceipt(createRequest));
    }

    @Test
    void should_ThrowException_When_ReceiptExists() {
        when(ifRepo.findById(formId)).thenReturn(Optional.of(form));
        when(receiptRepo.existsById(formId)).thenReturn(true);
        
        assertThrows(IllegalArgumentException.class, () -> receiptService.createReceipt(createRequest));
    }

    @Test
    void should_ThrowException_When_EstimateNotFound() {
        when(ifRepo.findById(formId)).thenReturn(Optional.of(form));
        when(receiptRepo.existsById(formId)).thenReturn(false);
        when(ceRepo.findByInstallationForm(form)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> receiptService.createReceipt(createRequest));
    }

    @Test
    void should_ThrowException_When_EstimateNotSigned() {
        when(ifRepo.findById(formId)).thenReturn(Optional.of(form));
        when(receiptRepo.existsById(formId)).thenReturn(false);
        
        CostEstimate estimate = new CostEstimate();
        estimate.setSignificance(new Significance()); // All blank
        
        when(ceRepo.findByInstallationForm(form)).thenReturn(Optional.of(estimate));

        var ex = assertThrows(IllegalArgumentException.class, () -> receiptService.createReceipt(createRequest));
        assertTrue(ex.getMessage().contains("ký duyệt đầy đủ"));
    }

    @Test
    void should_UpdateReceipt_Fully() {
        UpdateRequest update = new UpdateRequest("LD", "2024001", "NEW-BL", "New Name", "New Addr", LocalDate.now(), false);
        Receipt receipt = new Receipt();
        receipt.setInstallationForm(form);
        
        when(receiptRepo.findById(formId)).thenReturn(Optional.of(receipt));
        when(receiptRepo.save(any())).thenReturn(receipt);

        var response = receiptService.updateReceipt(update);
        
        assertEquals("NEW-BL", response.receiptNumber());
        assertEquals("New Name", response.customerName());
        verify(receiptRepo).save(any());
    }

    @Test
    void should_UpdateReceipt_Partially() {
        UpdateRequest update = new UpdateRequest("LD", "2024001", null, null, null, null, null);
        Receipt receipt = new Receipt();
        receipt.setInstallationForm(form);
        receipt.setReceiptNumber("OLD");
        
        when(receiptRepo.findById(formId)).thenReturn(Optional.of(receipt));
        when(receiptRepo.save(any())).thenReturn(receipt);

        var response = receiptService.updateReceipt(update);
        
        assertEquals("OLD", response.receiptNumber()); // Unchanged
    }

    @Test
    void should_Delete_When_Exists() {
        when(receiptRepo.existsById(formId)).thenReturn(true);
        
        receiptService.deleteReceipt("LD", "2024001");
        
        verify(receiptRepo).deleteById(formId);
    }

    @Test
    void should_Get_When_Exists() {
        Receipt receipt = new Receipt();
        receipt.setInstallationForm(form);
        receipt.setReceiptNumber("BL123");
        
        when(receiptRepo.findById(formId)).thenReturn(Optional.of(receipt));
        
        var response = receiptService.getReceipt("LD", "2024001");
        assertEquals("BL123", response.receiptNumber());
    }
}
