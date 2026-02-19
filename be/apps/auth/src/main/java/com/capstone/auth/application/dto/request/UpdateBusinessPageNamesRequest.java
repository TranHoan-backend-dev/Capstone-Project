package com.capstone.auth.application.dto.request;

import java.util.Set;

public record UpdateBusinessPageNamesRequest(
  String empId,
  Set<String> pages
) {
}
