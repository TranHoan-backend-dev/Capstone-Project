package com.capstone.customer.exception;

import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
  // All repetitive exceptions are now handled by com.capstone.common.exception.GlobalExceptionHandler
}
