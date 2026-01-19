package com.capstone.construction.infrastructure.utils;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

import java.util.Base64;

public class IdEncoder {
  public static String encode(@NonNull String id) {
    return Base64.getUrlEncoder().encodeToString(id.getBytes());
  }

  @Nullable
  public static String decode(@NonNull String encoded) {
    try {
      return new String(Base64.getUrlDecoder().decode(encoded));
    } catch (Exception e) {
      return null;
    }
  }
}








