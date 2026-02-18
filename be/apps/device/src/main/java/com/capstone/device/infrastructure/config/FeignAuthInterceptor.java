package com.capstone.device.infrastructure.config;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@Configuration
public class FeignAuthInterceptor implements RequestInterceptor {

  @Override
  public void apply(RequestTemplate template) {
    var auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth instanceof JwtAuthenticationToken jwtAuth) {
      var token = jwtAuth.getToken().getTokenValue();
      template.header("Authorization", "Bearer " + token);
    }
  }
}
