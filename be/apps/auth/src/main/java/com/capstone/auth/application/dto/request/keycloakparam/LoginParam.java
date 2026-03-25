package com.capstone.auth.application.dto.request.keycloakparam;

import feign.form.FormProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginParam {
  @FormProperty("grant_type")
  String grantType;

  @FormProperty("client_id")
  String clientId;

  @FormProperty("client_secret")
  String clientSecret;

  String username;

  String password;
  String scope;
}
