package com.capstone.notification.config;

import com.capstone.common.annotation.AppLog;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@AppLog
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
  private Logger log;

  @Override
  public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
    registry.addEndpoint("/ws")
      .setAllowedOrigins("http://localhost:3000")
      .setAllowedOriginPatterns("*")
      .withSockJS();
  }

  @Override
  public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/topic", "/user", "/queue", "/notification", "/technical", "/construction",
      "/business", "/it", "/finance", "/leadership", "/general");
    registry.setApplicationDestinationPrefixes("/app");
  }
}
