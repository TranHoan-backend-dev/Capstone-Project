package com.capstone.organization.service.boundary;

import com.capstone.organization.dto.request.page.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.page.FilterBusinessPagesRequest;
import com.capstone.organization.dto.request.page.UpdateBusinessPageRequest;
import com.capstone.organization.dto.response.BusinessPageResponse;
import com.capstone.organization.dto.response.PagedBusinessPageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BusinessPageService {
  BusinessPageResponse createBusinessPage(CreateBusinessPageRequest request);

  BusinessPageResponse updateBusinessPage(String pageId, UpdateBusinessPageRequest request);

  /**
   * Used for get all business website pages with pagination.
   *
   * @param pageable page index and page size. Must larger or equal to 0.
   * @return PagedBusinessPageResponse: include list of pages, page index, page size, total items, total pages
   */
  PagedBusinessPageResponse getBusinessPages(Pageable pageable);

  /**
   * Used for get all business website pages with pagination and filter. Filter by page name and activate status.
   *
   * @param pageable page index and page size. Must larger or equal to 0.
   * @param req The filter param. Including page name, activate status
   * @return PagedBusinessPageResponse: include list of pages, page index, page size, total items, total pages
   */
  PagedBusinessPageResponse filterBusinessPagesList(FilterBusinessPagesRequest req, Pageable pageable);

  List<String> getAllBusinessPageNamesByIds(List<String> ids);
}
