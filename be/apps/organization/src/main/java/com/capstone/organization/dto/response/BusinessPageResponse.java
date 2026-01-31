package com.capstone.organization.dto.response;

public record BusinessPageResponse(
  String pageId,
  String name,
  Boolean activate,
  String creator,
  String updator
) {
}
