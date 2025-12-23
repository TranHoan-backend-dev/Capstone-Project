package com.capstone.auth.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public record SignupRequest(
  String username,

  @Pattern(
    regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
    message = "Invalid password. Password must contain at least one number, one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long"
  )
  String password,

  @Email(message = "Email must follow the format <name>@<domain>")
  String email,

  String fullName,
  Boolean status
) {
}
