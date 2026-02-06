package com.capstone.organization.service.boundary;

import com.capstone.organization.dto.request.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.UpdateBusinessPageRequest;
import com.capstone.organization.dto.response.BusinessPageResponse;
import com.capstone.organization.dto.response.PagedBusinessPageResponse;

public interface BusinessPageService {
  BusinessPageResponse createBusinessPage(CreateBusinessPageRequest request);

  BusinessPageResponse updateBusinessPage(String pageId, UpdateBusinessPageRequest request);

  /**
   * Used for get all business website pages with pagination.
   * @param page page index. Must larger or equal to 0.
   * @param size max number of items in a page. Default value is 10.
   * @return PagedBusinessPageResponse: include list of pages, page index, page size, total items, total pages
   */
  PagedBusinessPageResponse getBusinessPages(int page, int size);
}
