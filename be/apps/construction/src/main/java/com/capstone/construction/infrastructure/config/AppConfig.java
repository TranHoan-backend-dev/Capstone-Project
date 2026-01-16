package com.capstone.construction.infrastructure.config;

import org.springframework.boot.task.ThreadPoolTaskExecutorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.concurrent.Executor;

@Configuration
public class AppConfig {
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean(name = "passwordEncoderExecutor")
  public Executor passwordEncoderExecutor() {
    return new ThreadPoolTaskExecutorBuilder()
      .corePoolSize(4)
      .maxPoolSize(8)
      .queueCapacity(50)
      .build();
  }
}
