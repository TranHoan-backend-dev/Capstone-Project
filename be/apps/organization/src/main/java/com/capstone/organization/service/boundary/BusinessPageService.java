package com.capstone.organization.service.boundary;

import com.capstone.organization.dto.request.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.UpdateBusinessPageRequest;
import com.capstone.organization.dto.response.BusinessPageResponse;
import com.capstone.organization.dto.response.PagedBusinessPageResponse;

public interface BusinessPageService {
  BusinessPageResponse createBusinessPage(CreateBusinessPageRequest request);

  BusinessPageResponse updateBusinessPage(String pageId, UpdateBusinessPageRequest request);

  PagedBusinessPageResponse getBusinessPages(int page, int size);
}
