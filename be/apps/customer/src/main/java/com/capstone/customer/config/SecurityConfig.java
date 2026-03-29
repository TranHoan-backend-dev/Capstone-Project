package com.capstone.customer.config;

import com.capstone.common.config.SharedSecurityConfig;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Import(SharedSecurityConfig.class)
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SecurityConfig {
  @Component
  @ConfigurationProperties(prefix = "cors")
  @Getter
  @Setter
  static class CorsProperties {
    private List<String> allowedOrigins;
  }

  JwtAuthenticationConverter converter;
  CorsProperties corsProperties;
  JwtDecoder decoder;
  final String[] PUBLIC_URLS = {
    "/actuator/**",
    "/v3/api-docs/**",
    "/swagger-ui/**",
  };

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
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
      .oauth2ResourceServer(oauth2 -> oauth2
        .jwt(jwt -> jwt
          .decoder(decoder)
          .jwtAuthenticationConverter(converter))
      )
      .build();
  }

  UrlBasedCorsConfigurationSource corsConfigurationSource() {
    var corsConfiguration = new CorsConfiguration();
    corsConfiguration.setAllowedOrigins(corsProperties.getAllowedOrigins());
    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH"));
    corsConfiguration.setAllowedHeaders(List.of("*"));
    corsConfiguration.setAllowCredentials(true);
    corsConfiguration.setMaxAge(3600L);

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfiguration);
    return source;
  }
}
