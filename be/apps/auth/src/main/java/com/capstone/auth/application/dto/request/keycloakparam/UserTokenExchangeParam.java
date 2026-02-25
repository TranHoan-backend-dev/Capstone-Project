package com.capstone.auth.application.dto.request.keycloakparam;

import com.fasterxml.jackson.annotation.JsonProperty;
import feign.form.FormProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserTokenExchangeParam {
  String username;
  String password;

  @FormProperty("grant_type")
  String grantType;

  @FormProperty("client_id")
  String clientId;

  @FormProperty("client_secret")
  String clientSecret;

  String scope;
}
