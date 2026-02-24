package com.capstone.auth.application.exception;

public class InternalServerError extends RuntimeException {
  public InternalServerError(String message) {
    super(message);
  }
}
