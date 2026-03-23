package com.capstone.device.application.business.material.group;

import com.capstone.device.application.dto.response.MaterialsGroupResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaterialsGroupService {
    Page<MaterialsGroupResponse> getPaginatedGroups(Pageable pageable, String filterName);
}
