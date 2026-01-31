package com.capstone.organization.service.impl;

import com.capstone.organization.dto.request.CreateJobRequest;
import com.capstone.organization.dto.request.UpdateJobRequest;
import com.capstone.organization.dto.response.JobResponse;
import com.capstone.organization.dto.response.PagedJobResponse;
import com.capstone.organization.model.Job;
import com.capstone.organization.repository.JobRepository;
import com.capstone.organization.service.boundary.JobService;
import com.capstone.organization.utils.IdEncoder;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobServiceImpl implements JobService {
  JobRepository jobRepository;

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
}
