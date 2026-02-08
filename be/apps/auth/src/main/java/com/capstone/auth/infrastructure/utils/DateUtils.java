package com.capstone.auth.infrastructure.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateUtils {
  public static boolean isLocalDate(String value, DateTimeFormatter formatter) {
    try {
      LocalDate.parse(value, formatter);
      return true;
    } catch (DateTimeParseException e) {
      return false;
    }
  }
}
