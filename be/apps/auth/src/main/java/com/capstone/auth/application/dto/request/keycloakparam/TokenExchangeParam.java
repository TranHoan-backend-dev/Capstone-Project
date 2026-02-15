package com.capstone.auth.application.dto.request.keycloakparam;

import feign.form.FormProperty;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenExchangeParam{
  @FormProperty("grant_type")
  String grantType;

  @FormProperty("client_id")
  String clientId;

  @FormProperty("client_secret")
  String clientSecret;
  String scope;
}
