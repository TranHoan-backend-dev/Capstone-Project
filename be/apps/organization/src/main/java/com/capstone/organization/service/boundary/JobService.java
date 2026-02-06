package com.capstone.organization.service.boundary;

import com.capstone.organization.dto.request.CreateJobRequest;
import com.capstone.organization.dto.request.UpdateJobRequest;
import com.capstone.organization.dto.response.JobResponse;
import com.capstone.organization.dto.response.PagedJobResponse;

public interface JobService {
  JobResponse createJob(CreateJobRequest request);

  JobResponse updateJob(String jobId, UpdateJobRequest request);

  PagedJobResponse getJobs(int page, int size);
}
