package com.capstone.auth.infrastructure.config;

public final class Constant {
  public static final String EMAIL_PATTERN = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
  public static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";
  public static final String PHONE_PATTERN = "^[0-9]{10}$";

  // for dto and entity layer
  public static final String PT_01 = "Email must follow the format <name>@<domain>";
  public static final String PT_02 = "Invalid password. Password must contain at least one number, one uppercase letter, one lowercase letter, one special character, and be at least 8 characters long";
  public static final String PT_03 = "Email must not be null or empty";
  public static final String PT_04 = "Password must not be null or empty";
  public static final String PT_05 = "Username must not be null or empty";
  public static final String PT_06 = "Role cannot be null or empty";
  public static final String PT_07 = "Role name cannot be null or empty";
  public static final String PT_08 = "Role must have at least one user";
  public static final String PT_09 = "Profile must have one user";
  public static final String PT_10 = "Fullname cannot be null or empty";
  public static final String PT_11 = "Avatar cannot be null or empty";
  public static final String PT_12 = "Address cannot be null or empty";
  public static final String PT_13 = "Fullname cannot have digits and special characters";
  public static final String PT_14 = "Phone number must be numberic and 10 digits long";
  public static final String PT_15 = "Phone number cannot be null or empty";
  public static final String PT_16 = "Gender cannot be null or empty";
  public static final String PT_17 = "Birthdate cannot be null or empty";
  public static final String PT_18 = "Branch id cannot be null or empty";
  public static final String PT_19 = "Department id cannot be null or empty";
  public static final String PT_20 = "Job id cannot be null or empty";
  public static final String PT_21 = "Business page ids cannot be null or empty";
  public static final String PT_22 = "List of notification ids cannot be null or empty";

  // for service layer
  public static final String SE_01 = "Email has been existing";
  public static final String SE_02 = "Email not found";
  public static final String SE_03 = "2 passwords do not match";
  public static final String SE_04 = "User is null";
  public static final String SE_05 = "This credential is not existing";
  public static final String SE_06 = "Profile of this account is not initialized";
}
