package com.capstone.auth.infrastructure.service.keycloak;

import com.capstone.auth.application.dto.request.keycloakparam.TokenExchangeParam;
import com.capstone.auth.application.dto.request.keycloakparam.UserCreationParam;
import com.capstone.auth.application.dto.request.keycloakparam.UserTokenExchangeParam;
import com.capstone.auth.application.dto.response.TokenExchangeResponse;
import com.capstone.common.config.feign.FeignMultipartConfig;
import feign.QueryMap;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(
  name = "keycloak-client",
  url = "${keycloak.server-url}",
  configuration = FeignMultipartConfig.class
)
public interface KeycloakFeignClient {
  String TOKEN_URL = "/realms/cmsn/protocol/openid-connect/token";
  String ADMIN_URL = "/admin/realms/cmsn";

  @PostMapping(
    value = TOKEN_URL, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
  TokenExchangeResponse exchangeToken(@RequestBody TokenExchangeParam param);

  @PostMapping(
    value = ADMIN_URL + "/users",
    consumes = MediaType.APPLICATION_JSON_VALUE
  )
  ResponseEntity<?> createUser(
    @RequestHeader("authorization") String token,
    @RequestBody UserCreationParam param
  );

  @PostMapping(value = TOKEN_URL, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
  TokenExchangeResponse exchangeUserToken(@QueryMap UserTokenExchangeParam param);

  @GetMapping(ADMIN_URL + "/roles/{roleName}")
  Map<String, Object> getRealmRole(
    @RequestHeader("authorization") String token,
    @PathVariable String roleName
  );

  @PostMapping(ADMIN_URL + "/users/{userId}/role-mappings/realm")
  void assignRealmRole(
    @RequestHeader("authorization") String token,
    @PathVariable String userId,
    @RequestBody List<Map<String, Object>> roles
  );
}
