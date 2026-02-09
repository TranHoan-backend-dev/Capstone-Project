package com.capstone.auth.application.exception;

public class IncompatibleAvatarException extends RuntimeException {
  public IncompatibleAvatarException() {
    super("Avatar is incompatible");
  }
}
