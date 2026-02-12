package com.capstone.auth.infrastructure.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Optional;

@Slf4j
@Configuration
public class FeignAuthInterceptor implements RequestInterceptor {

  @Override
  public void apply(RequestTemplate template) {
    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth instanceof JwtAuthenticationToken jwtAuth) {
      var token = jwtAuth.getToken().getTokenValue();
      log.info("Token: {}", Optional.ofNullable(token));
      template.header("Authorization", "Bearer " + token);
    }
  }
}
