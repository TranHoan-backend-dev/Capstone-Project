package com.capstone.organization.service.impl;

import com.capstone.organization.dto.request.page.CreateBusinessPageRequest;
import com.capstone.organization.dto.request.page.UpdateBusinessPageRequest;
import com.capstone.organization.dto.request.page.FilterBusinessPagesRequest;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.organization.event.producer.MessageProducer;
import com.capstone.organization.model.BusinessPage;
import com.capstone.organization.repository.BusinessPageRepository;
import com.capstone.organization.service.boundary.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BusinessPageServiceImplTest {
  @Mock
  BusinessPageRepository businessPageRepository;

  @Mock
  EmployeeService employeeService;

  @Mock
  MessageProducer messageProducer;

  @InjectMocks
  BusinessPageServiceImpl businessPageService;

  @BeforeEach
  void setUp() {
    lenient().when(employeeService.getEmployeeNameById(anyString()))
        .thenReturn(new WrapperApiResponse(200, "Success", "Employee Name", null));

    ReflectionTestUtils.setField(businessPageService, "PREFIX", ".page.");
    ReflectionTestUtils.setField(businessPageService, "ACTION", "update");
    ReflectionTestUtils.setField(businessPageService, "QUEUE_NAME", "org-queue");
  }

  @Test
  void createBusinessPageReturnsResponse() {
    var request = new CreateBusinessPageRequest("Sales", true, "creator-1", "updator-1");
    var saved = BusinessPage.create(b -> b.name("Sales").activate(true).creator("creator-1").updator("updator-1"));
    ReflectionTestUtils.setField(saved, "pageId", "page-1");
    when(businessPageRepository.save(any(BusinessPage.class))).thenReturn(saved);

    var response = businessPageService.createBusinessPage(request);

    assertThat(response.pageId()).isEqualTo("page-1");
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
  void updateBusinessPageReturnsResponseAndSendsMessageWhenDeactivated() {
    var request = new UpdateBusinessPageRequest("Support", false, "updator-2");
    var existing = BusinessPage.create(b -> b.name("Old").activate(true).creator("creator-2").updator("updator-1"));
    ReflectionTestUtils.setField(existing, "pageId", "page-2");
    when(businessPageRepository.findById("page-2")).thenReturn(Optional.of(existing));

    var response = businessPageService.updateBusinessPage("page-2", request);

    assertThat(response.pageId()).isEqualTo("page-2");
    assertThat(response.name()).isEqualTo("Support");
    assertThat(response.activate()).isFalse();
    verify(messageProducer).send(eq("org-queue.page.update"), any());
    verify(messageProducer).sendWithDelay(eq("update-page"), eq("page-2"));
    verify(businessPageRepository, never()).save(any());
  }

  @Test
  void updateBusinessPageReturnsResponseAndSavesWhenActivateIsTrue() {
    var request = new UpdateBusinessPageRequest("Support", true, "updator-2");
    var existing = BusinessPage.create(b -> b.name("Old").activate(false).creator("creator-2").updator("updator-1"));
    ReflectionTestUtils.setField(existing, "pageId", "page-2");
    when(businessPageRepository.findById("page-2")).thenReturn(Optional.of(existing));
    when(businessPageRepository.save(any(BusinessPage.class))).thenReturn(existing);

    var response = businessPageService.updateBusinessPage("page-2", request);

    assertThat(response.name()).isEqualTo("Support");
    assertThat(response.activate()).isTrue();
    verify(businessPageRepository).save(existing);
    verify(messageProducer, never()).send(anyString(), any());
  }

  @Test
  void updateBusinessPageThrowsWhenNameIsEmpty() {
    var request = new UpdateBusinessPageRequest(" ", true, "updator-1");
    var existing = BusinessPage.create(b -> b.name("Old").activate(true).creator("creator-1").updator("updator-1"));
    ReflectionTestUtils.setField(existing, "pageId", "page-1");
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
    var p1 = BusinessPage.create(b -> b.name("Sales").activate(true).creator("creator-1").updator("updator-1"));
    ReflectionTestUtils.setField(p1, "pageId", "page-1");
    var p2 = BusinessPage.create(b -> b.name("Support").activate(false).creator("creator-2").updator("updator-2"));
    ReflectionTestUtils.setField(p2, "pageId", "page-2");
    var items = List.of(p1, p2);
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
    var p1 = BusinessPage.create(b -> b.name("Sales").activate(true).creator("creator-1").updator("updator-1"));
    ReflectionTestUtils.setField(p1, "pageId", "page-1");
    var p2 = BusinessPage.create(b -> b.name("Support").activate(false).creator("creator-2").updator("updator-2"));
    ReflectionTestUtils.setField(p2, "pageId", "page-2");
    var pages = List.of(p1, p2);
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

  @Test
  void filterBusinessPagesList_ReturnsPagedResponse() {
    var req = new FilterBusinessPagesRequest("Sales", true);
    var pageable = PageRequest.of(0, 10);
    var p1 = BusinessPage.create(b -> b.name("Sales").activate(true).creator("creator-1").updator("updator-1"));
    ReflectionTestUtils.setField(p1, "pageId", "page-1");
    var items = List.of(p1);
    var page = new PageImpl<>(items, pageable, 1);
    when(businessPageRepository.findByNameAndActivate("Sales", true, pageable)).thenReturn(page);

    var response = businessPageService.filterBusinessPagesList(req, pageable);

    assertThat(response.items()).hasSize(1);
    verify(businessPageRepository).findByNameAndActivate("Sales", true, pageable);
  }
}
