package com.capstone.auth.infrastructure.config;

import com.capstone.common.config.SharedSecurityConfig;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.task.ThreadPoolTaskExecutorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestTemplate;

import org.springframework.data.web.config.EnableSpringDataWebSupport;

import java.util.concurrent.Executor;

@RequiredArgsConstructor
@Configuration
@EnableSpringDataWebSupport(pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Import(SharedSecurityConfig.class)
public class AppConfig {
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean(name = "passwordEncoderExecutor")
  Executor passwordEncoderExecutor() {
    return new ThreadPoolTaskExecutorBuilder()
      .corePoolSize(4)
      .maxPoolSize(8)
      .queueCapacity(50)
      .build();
  }

  @Bean
  RestTemplate restTemplate() {
    return new RestTemplate();
  }
}
