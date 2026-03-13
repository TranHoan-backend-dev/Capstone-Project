package com.capstone.organization.service.boundary;

import com.capstone.organization.dto.request.job.CreateJobRequest;
import com.capstone.organization.dto.request.job.UpdateJobRequest;
import com.capstone.organization.dto.request.job.FilterJobRequest;
import com.capstone.organization.dto.response.JobResponse;
import com.capstone.organization.dto.response.PagedJobResponse;
import org.springframework.data.domain.Pageable;

public interface JobService {
  JobResponse createJob(CreateJobRequest request);

  JobResponse updateJob(String jobId, UpdateJobRequest request);

  void deleteJob(String jobId);

  PagedJobResponse getJobs(Pageable pageable, FilterJobRequest filter);

  boolean checkExistence(String jobId);
}
