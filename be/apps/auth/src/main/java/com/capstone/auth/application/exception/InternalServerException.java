package com.capstone.auth.application.exception;

public class InternalServerException extends RuntimeException {
  public InternalServerException() {
    super("There is an internal server error happening");
  }
}
