package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.receipt.ReceiptService;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.receipt.CreatedEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReceiptUseCaseTest {

  @Mock
  ReceiptService receiptService;
  @Mock
  MessageProducer messageProducer;

  @InjectMocks
  ReceiptUseCase receiptUseCase;

  private ReceiptResponse mockResponse;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(receiptUseCase, "ENTITY_NAME", "receipt");
    ReflectionTestUtils.setField(receiptUseCase, "CREATE_ACTION", "create");
    ReflectionTestUtils.setField(receiptUseCase, "QUEUE_NAME", "construction_queue");

    mockResponse = new ReceiptResponse(
        "LD", "2024001", "BL001", "Customer", "Address", LocalDate.now(), true,
        LocalDateTime.now(), LocalDateTime.now()
    );
  }

  @Test
  @DisplayName("Create receipt should save and publish event")
  void createReceipt_ShouldReturnResponseAndPublishEvent() {
    var request = new CreateRequest("LD", "2024001", "BL001", "C", "A", LocalDate.now(), true);
    when(receiptService.createReceipt(request)).thenReturn(mockResponse);

    var result = receiptUseCase.createReceipt(request);

    assertThat(result).isNotNull();
    assertThat(result.receiptNumber()).isEqualTo("BL001");
    verify(receiptService).createReceipt(request);
    verify(messageProducer).send(eq("construction_queue.receipt.create"), any(CreatedEvent.class));
  }

  @Test
  @DisplayName("Update receipt successfully")
  void updateReceipt_ShouldReturnResponse() {
    var request = new UpdateRequest("LD", "2024001", "BL001", "C", "A", LocalDate.now(), true);
    when(receiptService.updateReceipt(request)).thenReturn(mockResponse);

    var result = receiptUseCase.updateReceipt(request);

    assertThat(result).isNotNull();
    verify(receiptService).updateReceipt(request);
  }

  @Test
  @DisplayName("Delete receipt successfully")
  void deleteReceipt_ShouldInvokeService() {
    receiptUseCase.deleteReceipt("LD", "2024001");

    verify(receiptService).deleteReceipt("LD", "2024001");
  }

  @Test
  @DisplayName("Get receipt successfully")
  void getReceipt_ShouldReturnResponse() {
    when(receiptService.getReceipt("LD", "2024001")).thenReturn(mockResponse);

    var result = receiptUseCase.getReceipt("LD", "2024001");

    assertThat(result).isNotNull();
    verify(receiptService).getReceipt("LD", "2024001");
  }
}
