package com.capstone.construction.application.business.commune;

import com.capstone.construction.application.dto.request.commune.CreateRequest;
import com.capstone.construction.application.dto.request.commune.UpdateRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CommuneService {
  void createCommune(CreateRequest request);

  CommuneResponse updateCommune(String id, UpdateRequest request);

  void deleteCommune(String id);

  CommuneResponse getCommuneById(String id);

  PageResponse<CommuneResponse> getAllCommunes(Pageable pageable);
}
