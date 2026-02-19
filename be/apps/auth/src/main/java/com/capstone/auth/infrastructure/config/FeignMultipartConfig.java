package com.capstone.auth.infrastructure.config;

import feign.codec.Encoder;
import feign.form.spring.SpringFormEncoder;
import org.springframework.boot.autoconfigure.http.HttpMessageConverters;
import org.springframework.cloud.openfeign.support.SpringEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignMultipartConfig {

  @Bean
  public Encoder feignFormEncoder() {
    return new SpringFormEncoder(new SpringEncoder(HttpMessageConverters::new));
  }
}
