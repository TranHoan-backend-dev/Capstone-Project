package com.capstone.device.application.business.material.group;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.dto.response.MaterialsGroupResponse;
import com.capstone.device.domain.model.MaterialsGroup;
import com.capstone.device.infrastructure.persistence.MaterialsGroupRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MaterialsGroupServiceImpl implements MaterialsGroupService {
  MaterialsGroupRepository repository;

  @NonFinal
  Logger log;

  @Override
  public Page<MaterialsGroupResponse> getPaginatedGroups(Pageable pageable, String filterName) {
    log.info("getPaginatedGroups using filter: {}", filterName);
    var result = filterName == null || filterName.isBlank() 
        ? repository.findAll(pageable)
        : repository.findByNameContainsIgnoreCase(filterName, pageable);
    
    var content = result.getContent().stream()
        .map(this::mapToResponse)
        .toList();
        
    return new PageImpl<>(content, pageable, result.getTotalElements());
  }

  private MaterialsGroupResponse mapToResponse(@NonNull MaterialsGroup group) {
    return new MaterialsGroupResponse(
        group.getGroupId(),
        group.getName(),
        group.getCreatedAt().toString(),
        group.getUpdatedAt().toString()
    );
  }
}
