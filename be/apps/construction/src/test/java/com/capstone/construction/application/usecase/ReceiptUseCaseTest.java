package com.capstone.construction.application.usecase;

import com.capstone.construction.application.business.receipt.ReceiptService;
import com.capstone.construction.application.dto.request.receipt.CreateRequest;
import com.capstone.construction.application.dto.request.receipt.UpdateRequest;
import com.capstone.construction.application.dto.response.receipt.ReceiptResponse;
import com.capstone.construction.application.event.producer.MessageProducer;
import com.capstone.construction.application.event.producer.receipt.CreatedEvent;
import com.capstone.construction.domain.model.utils.significance.ReceiptSignificance;
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

    var sig = ReceiptSignificance.builder().receiptCreator("S1").treasurer("S2").build();

    mockResponse = new ReceiptResponse(
      "1001", "1", "BL001", "Customer", "Address", LocalDate.now(), true,
      "Payment Reason", "1000", "One Thousand", "Attach", sig,
      LocalDateTime.now(), LocalDateTime.now()
    );
  }

  @Test
  @DisplayName("Create receipt should save and NOT publish event")
  void createReceipt_ShouldReturnResponse() {
    var request = new CreateRequest(
      1001L, 1L, "BL001",
      "Reason", "1000", "One Thousand", "Attach",
      LocalDate.now(), true, "S"
    );
    when(receiptService.createReceipt(request)).thenReturn(mockResponse);

    var result = receiptUseCase.createReceipt(request);

    assertThat(result).isNotNull();
    assertThat(result.receiptNumber()).isEqualTo("BL001");
    verify(receiptService).createReceipt(request);
    verifyNoInteractions(messageProducer);
  }

  @Test
  @DisplayName("Update receipt should return response and publish event when fully signed")
  void updateReceipt_ShouldReturnResponseAndPublishEvent() {
    var request = new UpdateRequest(1001L, 1L, "BL001", "C", "A", LocalDate.now(), true, "S2");
    when(receiptService.updateReceipt(request)).thenReturn(mockResponse);

    var result = receiptUseCase.updateReceipt(request);

    assertThat(result).isNotNull();
    verify(receiptService).updateReceipt(request);
    verify(messageProducer).send(eq("construction_queue.receipt.create"), any(CreatedEvent.class));
  }

  @Test
  @DisplayName("Delete receipt successfully")
  void deleteReceipt_ShouldInvokeService() {
    receiptUseCase.deleteReceipt(1001L, 1L);
    verify(receiptService).deleteReceipt(1001L, 1L);
  }

  @Test
  @DisplayName("Get receipt successfully")
  void getReceipt_ShouldReturnResponse() {
    when(receiptService.getReceipt(1001L, 1L)).thenReturn(mockResponse);
    var result = receiptUseCase.getReceipt(1001L, 1L);
    assertThat(result).isNotNull();
    verify(receiptService).getReceipt(1001L, 1L);
  }
}
