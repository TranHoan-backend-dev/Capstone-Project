package com.capstone.organization.service.impl;

import com.capstone.organization.dto.request.CreateJobRequest;
import com.capstone.organization.dto.request.UpdateJobRequest;
import com.capstone.organization.model.Job;
import com.capstone.organization.repository.JobRepository;
import com.capstone.organization.utils.IdEncoder;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobServiceImplTest {
  @Mock
  JobRepository jobRepository;

  @InjectMocks
  JobServiceImpl jobService;

  @Test
  void createJobReturnsResponse() {
    var now = LocalDateTime.of(2026, 1, 31, 12, 0);
    var request = new CreateJobRequest("Engineer");
    var saved = new Job("job-1", "Engineer", now, now);
    when(jobRepository.save(any(Job.class))).thenReturn(saved);

    var response = jobService.createJob(request);

    assertThat(response.jobId()).isEqualTo(IdEncoder.encode("job-1"));
    assertThat(response.name()).isEqualTo("Engineer");
    assertThat(response.createdAt()).isEqualTo(now);
    assertThat(response.updatedAt()).isEqualTo(now);
  }

  @Test
  void updateJobReturnsResponse() {
    var createdAt = LocalDateTime.of(2026, 1, 30, 9, 0);
    var updatedAt = LocalDateTime.of(2026, 1, 31, 10, 0);
    var request = new UpdateJobRequest("Senior Engineer");
    var existing = new Job("job-2", "Engineer", createdAt, createdAt);
    when(jobRepository.findById("job-2")).thenReturn(Optional.of(existing));
    when(jobRepository.save(existing)).thenReturn(new Job("job-2", "Senior Engineer", createdAt, updatedAt));

    var response = jobService.updateJob("job-2", request);

    assertThat(response.jobId()).isEqualTo(IdEncoder.encode("job-2"));
    assertThat(response.name()).isEqualTo("Senior Engineer");
    assertThat(response.createdAt()).isEqualTo(createdAt);
    assertThat(response.updatedAt()).isEqualTo(updatedAt);
  }

  @Test
  void updateJobThrowsWhenNotFound() {
    var request = new UpdateJobRequest("Senior Engineer");
    when(jobRepository.findById("missing")).thenReturn(Optional.empty());

    assertThatThrownBy(() -> jobService.updateJob("missing", request))
      .isInstanceOf(IllegalArgumentException.class)
      .hasMessage("Job not found");
  }

  @Test
  void getJobsReturnsPagedResponse() {
    var createdAt = LocalDateTime.of(2026, 1, 30, 9, 0);
    var updatedAt = LocalDateTime.of(2026, 1, 31, 10, 0);
    var pageRequest = PageRequest.of(0, 2);
    var items = List.of(
      new Job("job-1", "Engineer", createdAt, updatedAt),
      new Job("job-2", "Designer", createdAt, updatedAt)
    );
    var page = new PageImpl<>(items, pageRequest, 2);
    when(jobRepository.findAll(pageRequest)).thenReturn(page);

    var response = jobService.getJobs(0, 2);

    assertThat(response.items()).hasSize(2);
    assertThat(response.page()).isEqualTo(0);
    assertThat(response.size()).isEqualTo(2);
    assertThat(response.totalItems()).isEqualTo(2);
    assertThat(response.totalPages()).isEqualTo(1);
    verify(jobRepository).findAll(pageRequest);
  }
}
