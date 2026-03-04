package com.capstone.construction.application.business.hamlet;

import com.capstone.construction.application.dto.request.hamlet.UpdateHamletRequest;
import com.capstone.construction.application.dto.response.catalog.HamletResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.enumerate.HamletType;
import org.springframework.data.domain.Pageable;

public interface HamletService {
  HamletResponse createHamlet(String name, HamletType type, String communeId);

  HamletResponse updateHamlet(String id, UpdateHamletRequest request);

  void deleteHamlet(String id);

  HamletResponse getHamletById(String id);

  PageResponse<HamletResponse> getAllHamlets(Pageable pageable);

  PageResponse<HamletResponse> searchHamletsByName(String keyword, Pageable pageable);
}
