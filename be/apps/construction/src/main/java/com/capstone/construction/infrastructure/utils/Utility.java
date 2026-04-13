package com.capstone.construction.infrastructure.utils;

import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class Utility {
  public static @NonNull Pageable sortByAttributeDesc(@NonNull Pageable pageable, String attribute) {
    return PageRequest.of(
      pageable.getPageNumber(),
      pageable.getPageSize(),
      Sort.by(Sort.Direction.DESC, attribute)
    );
  }
}
