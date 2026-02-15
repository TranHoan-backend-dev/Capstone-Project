package com.capstone.organization.service.impl;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.IdEncoder;
import com.capstone.organization.dto.request.CreateJobRequest;
import com.capstone.organization.dto.request.UpdateJobRequest;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobServiceImpl implements JobService {
  JobRepository jobRepository;
  @NonFinal
  Logger log;

  @Override
  public JobResponse createJob(@NonNull CreateJobRequest request) {
    log.info("Creating job with name: {}", request.name());

    var entity = Job.create(builder -> builder
      .name(request.name())
    );

    var saved = jobRepository.save(entity);
    return new JobResponse(
      IdEncoder.encode(saved.getId()),
      saved.getName(),
      saved.getCreatedAt(),
      saved.getUpdatedAt()
    );
  }

  @Override
  public JobResponse updateJob(String jobId, @NonNull UpdateJobRequest request) {
    log.info("Updating job: {}", jobId);

    var entity = jobRepository.findById(jobId)
      .orElseThrow(() -> new IllegalArgumentException("Job not found"));

    entity.setName(request.name());

    var saved = jobRepository.save(entity);
    return new JobResponse(
      IdEncoder.encode(saved.getId()),
      saved.getName(),
      saved.getCreatedAt(),
      saved.getUpdatedAt()
    );
  }

  @Override
  public PagedJobResponse getJobs(int page, int size) {
    log.info("Fetching jobs page: {}, size: {}", page, size);

    var result = jobRepository.findAll(PageRequest.of(page, size));
    var items = result.getContent().stream()
      .map(job -> new JobResponse(
        IdEncoder.encode(job.getId()),
        job.getName(),
        job.getCreatedAt(),
        job.getUpdatedAt()
      ))
      .collect(Collectors.toList());

    return new PagedJobResponse(
      items,
      result.getNumber(),
      result.getSize(),
      result.getTotalElements(),
      result.getTotalPages()
    );
  }

  @Override
  public boolean checkExistence(String jobId) {
    return jobRepository.existsById(jobId);
  }
}
