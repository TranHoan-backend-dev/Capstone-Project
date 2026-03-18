package com.capstone.construction.application.event.receipt;

import com.capstone.construction.domain.model.Receipt;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ReceiptCreatedEvent extends ApplicationEvent {
  private final Receipt receipt;

  public ReceiptCreatedEvent(Object source, Receipt receipt) {
    super(source);
    this.receipt = receipt;
  }
}
