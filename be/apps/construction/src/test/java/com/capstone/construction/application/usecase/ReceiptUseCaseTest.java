package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.receipt.ReceiptService;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReceiptUseCaseTest {

    @Mock ReceiptService receiptService;
    @Mock MessageProducer messageProducer;

    @InjectMocks ReceiptUseCase receiptUseCase;

    ReceiptResponse response;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(receiptUseCase, "ENTITY_NAME", "receipt");
        ReflectionTestUtils.setField(receiptUseCase, "CREATE_ACTION", "create");
        ReflectionTestUtils.setField(receiptUseCase, "QUEUE_NAME", "construction_queue");
        
        response = new ReceiptResponse(
            "LD", "2024001", "BL001", "Customer", "Address", LocalDate.now(), true, 
            LocalDateTime.now(), LocalDateTime.now()
        );
    }

    @Test
    void should_CreateReceipt_Then_PublishEvent() {
        CreateRequest request = new CreateRequest("LD", "2024001", "BL001", "C", "A", LocalDate.now(), true);
        when(receiptService.createReceipt(request)).thenReturn(response);
        
        var result = receiptUseCase.createReceipt(request);
        
        assertNotNull(result);
        verify(receiptService).createReceipt(request);
        verify(messageProducer).send(eq("construction_queue.receipt.create"), any());
    }

    @Test
    void should_UpdateReceipt() {
        UpdateRequest request = new UpdateRequest("LD", "2024001", "BL001", "C", "A", LocalDate.now(), true);
        when(receiptService.updateReceipt(request)).thenReturn(response);
        
        receiptUseCase.updateReceipt(request);
        verify(receiptService).updateReceipt(request);
    }

    @Test
    void should_DeleteReceipt() {
        receiptUseCase.deleteReceipt("LD", "2024001");
        verify(receiptService).deleteReceipt("LD", "2024001");
    }

    @Test
    void should_GetReceipt() {
        when(receiptService.getReceipt("LD", "2024001")).thenReturn(response);
        receiptUseCase.getReceipt("LD", "2024001");
        verify(receiptService).getReceipt("LD", "2024001");
    }
}
