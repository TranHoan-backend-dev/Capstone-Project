package com.capstone.construction.application.dto.response.installationform;

import java.util.List;

public record ReviewedInstallationFormsResponse(
  List<InstallationFormListResponse> approved,
  List<InstallationFormListResponse> rejected
) {
}
