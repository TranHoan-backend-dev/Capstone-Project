package com.capstone.common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggerConfig {

  @Bean
  @ConditionalOnMissingBean
  public static LoggerPostProcessor loggerPostProcessor() {
    return new LoggerPostProcessor();
  }
}
