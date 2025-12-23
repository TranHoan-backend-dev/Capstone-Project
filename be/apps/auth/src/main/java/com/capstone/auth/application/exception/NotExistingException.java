package com.capstone.auth.application.exception;

public class NotExistingException extends RuntimeException {
  public NotExistingException(String message) {
    super(message);
  }
}
