package com.capstone.auth.application.dto.request.keycloakparam;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationParam {
  String username;
  boolean enabled;
  String email;
  boolean emailVerified;
  String firstName;
  String lastName;
  List<Credential> credentials;
}
