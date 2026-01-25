package com.capstone.auth.application.exception;

public class AccountBlockedException extends RuntimeException {
  public AccountBlockedException(String message) {
    super(message);
  }
}
