package com.capstone.organization.service.impl;

import com.capstone.common.annotation.AppLog;
import com.capstone.organization.dto.request.job.CreateJobRequest;
import com.capstone.organization.dto.request.job.UpdateJobRequest;
import com.capstone.organization.dto.request.job.FilterJobRequest;
import com.capstone.organization.dto.response.JobResponse;
import com.capstone.organization.dto.response.PagedJobResponse;
import com.capstone.organization.model.Job;
import com.capstone.organization.repository.JobRepository;
import com.capstone.organization.service.boundary.JobService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import com.capstone.organization.service.boundary.EmployeeService;
import com.capstone.organization.utils.Constant;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobServiceImpl implements JobService {
  JobRepository jobRepository;
  EmployeeService employeeService;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public JobResponse createJob(@NonNull CreateJobRequest request) {
    log.info("Creating job with name: {}", request.name());

    if (jobRepository.existsByNameIgnoreCase(request.name())) {
      throw new IllegalArgumentException(Constant.ORG_13.concat(": ").concat(request.name()));
    }

    var entity = Job.create(builder -> builder
      .name(request.name()));

    var saved = jobRepository.save(entity);
    return convert(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public JobResponse updateJob(String jobId, @NonNull UpdateJobRequest request) {
    log.info("Updating job: {}", jobId);

    var entity = jobRepository.findById(jobId)
      .orElseThrow(() -> new IllegalArgumentException(Constant.ORG_12));

    jobRepository.findByNameIgnoreCase(request.name())
      .ifPresent(existing -> {
        if (!existing.getId().equals(jobId)) {
          throw new IllegalArgumentException(Constant.ORG_13);
        }
      });

    entity.setName(request.name());

    var saved = jobRepository.save(entity);
    return convert(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteJob(String jobId) {
    log.info("Deleting job: {}", jobId);

    if (!jobRepository.existsById(jobId)) {
      throw new IllegalArgumentException(Constant.ORG_12);
    }

    var response = employeeService.isJobAssigned(jobId);
    if (response != null && response.data() != null && (Boolean) response.data()) {
      throw new IllegalArgumentException(Constant.ORG_14);
    }

    jobRepository.deleteById(jobId);
  }

  @Override
  public PagedJobResponse getJobs(Pageable pageable, FilterJobRequest filter) {
    log.info("Fetching jobs with filters: {}", filter);

    LocalDateTime start = null;
    LocalDateTime end = null;

    if (filter.fromDate() != null) {
      start = filter.fromDate().atStartOfDay();
    }
    if (filter.toDate() != null) {
      end = filter.toDate().atTime(23, 59, 59);
    }

    var result = jobRepository.searchJobs(filter.name(), start, end, pageable);

    var items = result.getContent().stream()
      .map(this::convert)
      .collect(Collectors.toList());

    return new PagedJobResponse(
      items,
      result.getNumber(),
      result.getSize(),
      result.getTotalElements(),
      result.getTotalPages());
  }

  @Override
  public boolean checkExistence(String jobId) {
    return jobRepository.existsById(jobId);
  }

  private @NonNull JobResponse convert(@NonNull Job job) {
    return new JobResponse(
      job.getId(),
      job.getName(),
      job.getCreatedAt(),
      job.getUpdatedAt());
  }
}
