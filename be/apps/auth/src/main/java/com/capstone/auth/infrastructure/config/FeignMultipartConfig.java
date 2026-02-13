package com.capstone.auth.infrastructure.config;

import feign.codec.Encoder;
import feign.form.spring.SpringFormEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignMultipartConfig {

  @Bean
  public Encoder feignFormEncoder() {
    return new SpringFormEncoder();
  }
}
