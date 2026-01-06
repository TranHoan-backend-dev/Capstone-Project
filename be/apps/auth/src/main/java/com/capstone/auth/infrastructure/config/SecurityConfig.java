package com.capstone.auth.infrastructure.config;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
      "/login/oauth2/code/google",
      "/oauth2/authorization/google",
      "/actuator/**",
      "/v3/api-docs/**",
      "/swagger-ui/**",
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
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .build();
  }

  @Bean
  public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
    var delegate = new DefaultOAuth2UserService();
    return userRequest -> {
      var user = delegate.loadUser(userRequest);
      Set<GrantedAuthority> authorities = new HashSet<>();

      String email = user.getAttribute("email");
      if (email != null) {
        authorities.add(new SimpleGrantedAuthority(!email.endsWith("@fpt.edu.vn") ? "ROLE_USER" : "ROLE_ADMIN"));
      }

      return new DefaultOAuth2User(
          authorities,
          user.getAttributes(),
          "email");
    };
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
