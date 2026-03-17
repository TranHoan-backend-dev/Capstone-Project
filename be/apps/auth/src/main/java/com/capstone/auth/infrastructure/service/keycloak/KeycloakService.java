package com.capstone.auth.infrastructure.service.keycloak;

import com.capstone.auth.infrastructure.utils.Message;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KeycloakService {
  Keycloak keycloak;

  @Value("${keycloak.realms}")
  @NonFinal
  String realm;

  @Value("${keycloak.server-url}")
  @NonFinal
  String serverUrl;

  @Value("${keycloak.client-id}")
  @NonFinal
  String clientId;

  @Value("${keycloak.client-secret}")
  @NonFinal
  String clientSecret;

  public void updatePasswordOnKeycloak(String userId, String newPassword) {
    try {
      var credential = new CredentialRepresentation();
      credential.setType(CredentialRepresentation.PASSWORD);
      credential.setValue(newPassword);
      credential.setTemporary(false);

      keycloak.realm(realm).users().get(userId).resetPassword(credential);
    } catch (Exception e) {
      throw new IllegalArgumentException(String.format(Message.SE_12, e.getMessage()));
    }
  }

  public void verifyOldPassword(String email, String oldPassword) {
    try (var tempKeycloak = KeycloakBuilder.builder()
      .serverUrl(serverUrl)
      .realm(realm)
      .clientId(clientId)
      .clientSecret(clientSecret)
      .username(email)
      .password(oldPassword)
      .grantType(OAuth2Constants.PASSWORD)
      .build()) {
//     Thử lấy token để xác thực mật khẩu
      tempKeycloak.tokenManager().getAccessToken();
      keycloak.tokenManager().getAccessToken();
    } catch (Exception e) {
      throw new IllegalArgumentException(Message.SE_14);
    }
  }
}
