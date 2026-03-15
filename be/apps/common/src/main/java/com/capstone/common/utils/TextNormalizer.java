package com.capstone.common.utils;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public final class TextNormalizer {
  private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");
  private static final Pattern WHITESPACE = Pattern.compile("\\s+");

  private TextNormalizer() {}

  /**
   * Normalize text for accent-insensitive search (Vietnamese-friendly).
   * <p>
   * - Lowercase
   * - Trim & collapse whitespace
   * - Remove diacritics (NFD + strip combining marks)
   * - Map 'đ/Đ' to 'd/D'
   */
  public static String normalizeForSearch(String input) {
    if (input == null) return null;
    var s = input.trim();
    if (s.isEmpty()) return null;

    s = Normalizer.normalize(s, Normalizer.Form.NFD);
    s = DIACRITICS.matcher(s).replaceAll("");
    s = s.replace('đ', 'd').replace('Đ', 'D');
    s = WHITESPACE.matcher(s).replaceAll(" ");
    return s.toLowerCase(Locale.ROOT);
  }
}

