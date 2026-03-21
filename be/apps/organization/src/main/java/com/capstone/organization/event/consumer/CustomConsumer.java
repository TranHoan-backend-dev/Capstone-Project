package com.capstone.organization.event.consumer;

import com.capstone.organization.repository.BusinessPageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomConsumer {
  final BusinessPageRepository businessPageRepository;

  @RabbitListener(queues = "update-page")
  public void handle(String id) {
    var businessPage = businessPageRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Business page not found"));
    businessPageRepository.save(businessPage);
  }
}

