package com.capstone.construction.application.event.receipt;

import com.capstone.construction.application.dto.request.notification.CreateNotificationRequest;
import com.capstone.construction.infrastructure.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ReceiptCreatedEventListener {
  private final NotificationService notificationService;

  @Async
  @EventListener
  public void handleReceiptCreatedEvent(ReceiptCreatedEvent event) {
    log.info("Handling receipt created event for receipt: {}", event.getReceipt().getReceiptNumber());
    var receipt = event.getReceipt();
    // Assuming the notification service will broadcast or has specific logic to notify ORDER_RECEIVING_STAFF
    var request = new CreateNotificationRequest(
      "Biên lai mới được tạo",
      "Biên lai số " + receipt.getReceiptNumber() + " đã được tạo cho khách hàng " + receipt.getCustomerName() + ". Vui lòng kiểm tra.",
      "/receipts/" + receipt.getInstallationFormId().getFormCode() + "/" + receipt.getInstallationFormId().getFormNumber()
    );
    try {
      notificationService.createNotification(request);
      log.info("Notification sent successfully for receipt: {}", receipt.getReceiptNumber());
    } catch (Exception e) {
      log.error("Failed to send notification for receipt: {}", receipt.getReceiptNumber(), e);
    }
  }
}
