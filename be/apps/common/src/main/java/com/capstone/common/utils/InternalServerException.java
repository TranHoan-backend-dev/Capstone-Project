package com.capstone.common.utils;

public class InternalServerException extends RuntimeException {
  public InternalServerException() {
    super("There is an internal server error happening");
  }
}
