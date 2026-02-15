package com.capstone.organization.service.impl;

import com.capstone.common.utils.IdEncoder;
import com.capstone.organization.dto.request.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.UpdateBusinessPageRequest;
import com.capstone.organization.model.BusinessPage;
import com.capstone.organization.repository.BusinessPageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessPageServiceImplTest {
  @Mock
  BusinessPageRepository businessPageRepository;

  @InjectMocks
  BusinessPageServiceImpl businessPageService;

  @Test
  void createBusinessPageReturnsResponse() {
    var request = new CreateBusinessPageRequest("Sales", true, "creator-1", "updator-1");
    var saved = new BusinessPage("page-1", "Sales", true, "creator-1", "updator-1");
    when(businessPageRepository.save(any(BusinessPage.class))).thenReturn(saved);

    var response = businessPageService.createBusinessPage(request);

    assertThat(response.pageId()).isEqualTo(IdEncoder.encode("page-1"));
    assertThat(response.name()).isEqualTo("Sales");
    assertThat(response.activate()).isTrue();
    assertThat(response.creator()).isEqualTo("creator-1");
    assertThat(response.updator()).isEqualTo("updator-1");
  }

  @Test
  void createBusinessPageThrowsWhenNameIsEmpty() {
    var request = new CreateBusinessPageRequest("", true, "creator-1", "updator-1");

    assertThatThrownBy(() -> businessPageService.createBusinessPage(request))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void createBusinessPageThrowsWhenActivateIsNull() {
    var request = new CreateBusinessPageRequest("Sales", null, "creator-1", "updator-1");

    assertThatThrownBy(() -> businessPageService.createBusinessPage(request))
      .isInstanceOf(NullPointerException.class);
  }

  @Test
  void updateBusinessPageReturnsResponse() {
    var request = new UpdateBusinessPageRequest("Support", false, "updator-2");
    var existing = new BusinessPage("page-2", "Old", true, "creator-2", "updator-1");
    when(businessPageRepository.findById("page-2")).thenReturn(Optional.of(existing));
    when(businessPageRepository.save(existing)).thenReturn(existing);

    var response = businessPageService.updateBusinessPage("page-2", request);

    assertThat(response.pageId()).isEqualTo(IdEncoder.encode("page-2"));
    assertThat(response.name()).isEqualTo("Support");
    assertThat(response.activate()).isFalse();
    assertThat(response.creator()).isEqualTo("creator-2");
    assertThat(response.updator()).isEqualTo("updator-2");
  }

  @Test
  void updateBusinessPageThrowsWhenNameIsEmpty() {
    var request = new UpdateBusinessPageRequest(" ", true, "updator-1");
    var existing = new BusinessPage("page-1", "Old", true, "creator-1", "updator-1");
    when(businessPageRepository.findById("page-1")).thenReturn(Optional.of(existing));

    assertThatThrownBy(() -> businessPageService.updateBusinessPage("page-1", request))
      .isInstanceOf(IllegalArgumentException.class);
  }

  @Test
  void updateBusinessPageThrowsWhenNotFound() {
    var request = new UpdateBusinessPageRequest("Support", false, "updator-2");
    when(businessPageRepository.findById("missing")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> businessPageService.updateBusinessPage("missing", request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage("Business page not found");
  }

  @Test
  void getBusinessPagesReturnsPagedResponse() {
    var pageRequest = PageRequest.of(1, 2);
    var items = List.of(
      new BusinessPage("page-1", "Sales", true, "creator-1", "updator-1"),
      new BusinessPage("page-2", "Support", false, "creator-2", "updator-2"));
    var page = new PageImpl<>(items, pageRequest, 4);
    when(businessPageRepository.findAll(pageRequest)).thenReturn(page);

    var response = businessPageService.getBusinessPages(pageRequest);

    assertThat(response.items()).hasSize(2);
    assertThat(response.page()).isEqualTo(1);
    assertThat(response.size()).isEqualTo(2);
    assertThat(response.totalItems()).isEqualTo(4);
    assertThat(response.totalPages()).isEqualTo(2);
    verify(businessPageRepository).findAll(pageRequest);
  }

  @Test
  void getBusinessPagesReturnsEmptyResponseWhenNoData() {
    var pageRequest = PageRequest.of(0, 10);
    var page = new PageImpl<BusinessPage>(List.of(), pageRequest, 0);
    when(businessPageRepository.findAll(pageRequest)).thenReturn(page);

    var response = businessPageService.getBusinessPages(pageRequest);

    assertThat(response.items()).isEmpty();
    assertThat(response.totalItems()).isZero();
    assertThat(response.totalPages()).isZero();
    verify(businessPageRepository).findAll(pageRequest);
  }

  @Test
  void getAllBusinessPageNamesByIds_ReturnsListOfNames() {
    var ids = List.of("page-1", "page-2");
    var pages = List.of(
      new BusinessPage("page-1", "Sales", true, "creator-1", "updator-1"),
      new BusinessPage("page-2", "Support", false, "creator-2", "updator-2"));
    when(businessPageRepository.findAllById(ids)).thenReturn(pages);

    var names = businessPageService.getAllBusinessPageNamesByIds(ids);

    assertThat(names).containsExactly("Sales", "Support");
    verify(businessPageRepository).findAllById(ids);
  }

  @Test
  void getAllBusinessPageNamesByIds_ReturnsEmptyList_WhenNoMatches() {
    var ids = List.of("missing-1", "missing-2");
    when(businessPageRepository.findAllById(ids)).thenReturn(List.of());

    var names = businessPageService.getAllBusinessPageNamesByIds(ids);

    assertThat(names).isEmpty();
    verify(businessPageRepository).findAllById(ids);
  }
}
