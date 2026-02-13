package com.capstone.common.utils;

import com.capstone.common.exception.InternalServerException;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;

import java.util.Base64;

@Slf4j
public class IdEncoder {
  public static String encode(@NonNull String id) {
    return Base64.getUrlEncoder().encodeToString(id.getBytes());
  }

  public static String decode(@NonNull String encoded) {
    try {
      return new String(Base64.getUrlDecoder().decode(encoded));
    } catch (Exception e) {
      log.error(e.getMessage());
      throw new InternalServerException();
    }
  }
}
