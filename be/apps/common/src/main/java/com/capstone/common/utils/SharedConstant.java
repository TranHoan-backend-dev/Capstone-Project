package com.capstone.common.utils;

public class SharedConstant {
  public static final String EMAIL_PATTERN = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
  public static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";
  public static final String PHONE_PATTERN = "^[0-9]{10}$";
  public static final String VIETNAMESE_CHARACTER_PATTERN = "^[\\p{L}\\s()]+$";
  public static final String DATE_PATTERN = "dd-MM-yyyy";
  public static final String UNACCENT = "unaccent";
}
