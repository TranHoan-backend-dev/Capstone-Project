package com.capstone.auth.controller;

import com.capstone.auth.dto.request.SignupRequest;
import com.capstone.auth.dto.response.WrapperApiResponse;
import com.capstone.auth.model.enumerate.RoleName;
import com.capstone.auth.service.boundary.UsersService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
  UsersService service;
  // TODO: custom error code

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest request) {
    log.info("Signup request comes to endpoint: {}", request);

    service.createEmployee(
      request.fullName(),
      request.username(),
      request.password(),
      request.email(),
      request.status() ? RoleName.EMPLOYEE : RoleName.CUSTOMER
    );

    return ResponseEntity.ok(new WrapperApiResponse(
      HttpStatus.OK.value(),
      "Create account successfully",
      null,
      LocalDateTime.now()
    ));
  }

  @PatchMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword() {
    return null;
  }

  @PatchMapping("/reset-password")
  public ResponseEntity<?> resetPassword() {
    return null;
  }

  @GetMapping("/me")
  public ResponseEntity<?> me() {
    return null;
  }
}
