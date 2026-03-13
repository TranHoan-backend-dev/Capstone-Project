package com.capstone.device.application.usecase;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.business.material.group.MaterialsGroupService;
import com.capstone.device.application.dto.response.MaterialsGroupResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MaterialsGroupUseCase {
  MaterialsGroupService groupService;

  @NonFinal
  Logger log;

  public Page<MaterialsGroupResponse> getMaterialsGroups(Pageable pageable, String filter) {
    log.info("Get materials groups using filter: {}", filter);
    return groupService.getPaginatedGroups(pageable, filter);
  }
}
