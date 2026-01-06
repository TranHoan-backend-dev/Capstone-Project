package com.capstone.notification.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class SecurityConfig {
  @Component
  @ConfigurationProperties(prefix = "cors")
  @Getter
  @Setter
  static class CorsProperties {
    private List<String> allowedOrigins;
  }

  CorsProperties corsProperties;
  final String[] PUBLIC_URLS = {
    "/auth/**",
    "/actuator/**"
  };

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) {
    return http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers(PUBLIC_URLS).permitAll()
        .anyRequest().authenticated())
      .exceptionHandling(ex -> ex
        .authenticationEntryPoint((request, response, authException) -> {
          response.setContentType("application/json");
          response.setStatus(HttpStatus.UNAUTHORIZED.value());
          response.getWriter().write("{\"error\": \"Authentication required\"}");
        })
        .accessDeniedHandler((request, response, exception) -> {
          response.setContentType("application/json");
          response.setStatus(HttpStatus.FORBIDDEN.value());
          response.getWriter().write("{\"error\": \"Access denied\"}");
        }))
      .build();
  }

  UrlBasedCorsConfigurationSource corsConfigurationSource() {
    var corsConfiguration = new CorsConfiguration();
    corsConfiguration.setAllowedOrigins(corsProperties.getAllowedOrigins());
    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    corsConfiguration.setAllowedHeaders(List.of("*"));
    corsConfiguration.setAllowCredentials(true);
    corsConfiguration.setMaxAge(3600L);

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);
    return source;
  }
}
