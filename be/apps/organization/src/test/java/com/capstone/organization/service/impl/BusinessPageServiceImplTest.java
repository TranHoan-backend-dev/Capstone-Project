package com.capstone.organization.service.impl;

import com.capstone.organization.dto.request.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.UpdateBusinessPageRequest;
import com.capstone.organization.model.BusinessPage;
import com.capstone.organization.repository.BusinessPageRepository;
import com.capstone.organization.utils.IdEncoder;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
      new BusinessPage("page-2", "Support", false, "creator-2", "updator-2")
    );
    var page = new PageImpl<>(items, pageRequest, 4);
    when(businessPageRepository.findAll(pageRequest)).thenReturn(page);

    var response = businessPageService.getBusinessPages(1, 2);

    assertThat(response.items()).hasSize(2);
    assertThat(response.page()).isEqualTo(1);
    assertThat(response.size()).isEqualTo(2);
    assertThat(response.totalItems()).isEqualTo(4);
    assertThat(response.totalPages()).isEqualTo(2);
    verify(businessPageRepository).findAll(pageRequest);
  }
}
