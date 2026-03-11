package com.capstone.organization.service.impl;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.organization.dto.request.CreateJobRequest;
import com.capstone.organization.dto.request.UpdateJobRequest;
import com.capstone.organization.dto.request.FilterJobRequest;
import com.capstone.organization.model.Job;
import com.capstone.organization.repository.JobRepository;
import com.capstone.organization.service.boundary.EmployeeService;
import com.capstone.organization.utils.Constant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceImplTest {

    @Mock
    JobRepository jobRepository;

    @Mock
    EmployeeService employeeService;

    @Mock
    Logger log;

    @InjectMocks
    JobServiceImpl jobService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jobService, "log", log);
    }

    @Test
    void should_CreateJob_When_ValidRequest() {
        var request = new CreateJobRequest("Engineer");
        when(jobRepository.existsByNameIgnoreCase("Engineer")).thenReturn(false);

        Job savedJob = createMockJob("1", "Engineer");
        when(jobRepository.save(any(Job.class))).thenReturn(savedJob);

        var result = jobService.createJob(request);

        assertThat(result.name()).isEqualTo("Engineer");
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    void should_ThrowException_When_CreateJobWithNameExists() {
        var request = new CreateJobRequest("Engineer");
        when(jobRepository.existsByNameIgnoreCase("Engineer")).thenReturn(true);

        assertThatThrownBy(() -> jobService.createJob(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage(Constant.ORG_13);
    }

    @Test
    void should_UpdateJob_When_ValidRequest() {
        var id = "1";
        var request = new UpdateJobRequest("Senior Engineer");
        var existingJob = createMockJob(id, "Engineer");

        when(jobRepository.findById(id)).thenReturn(Optional.of(existingJob));
        when(jobRepository.findByNameIgnoreCase("Senior Engineer")).thenReturn(Optional.empty());
        when(jobRepository.save(any(Job.class))).thenReturn(createMockJob(id, "Senior Engineer"));

        var result = jobService.updateJob(id, request);

        assertThat(result.name()).isEqualTo("Senior Engineer");
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    void should_UpdateJob_When_NameIsSameAsExisting() {
        var id = "1";
        var request = new UpdateJobRequest("Engineer");
        var existingJob = createMockJob(id, "Engineer");

        when(jobRepository.findById(id)).thenReturn(Optional.of(existingJob));
        when(jobRepository.findByNameIgnoreCase("Engineer")).thenReturn(Optional.of(existingJob));
        when(jobRepository.save(any(Job.class))).thenReturn(existingJob);

        var result = jobService.updateJob(id, request);

        assertThat(result.name()).isEqualTo("Engineer");
    }

    @Test
    void should_ThrowException_When_UpdateJobNotFound() {
        var id = "1";
        var request = new UpdateJobRequest("Engineer");
        when(jobRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.updateJob(id, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage(Constant.ORG_12);
    }

    @Test
    void should_ThrowException_When_UpdateJobWithNameExists() {
        var id = "1";
        var otherId = "2";
        var request = new UpdateJobRequest("Manager");
        var existingJob = createMockJob(id, "Engineer");
        var otherJob = createMockJob(otherId, "Manager");

        when(jobRepository.findById(id)).thenReturn(Optional.of(existingJob));
        when(jobRepository.findByNameIgnoreCase("Manager")).thenReturn(Optional.of(otherJob));

        assertThatThrownBy(() -> jobService.updateJob(id, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage(Constant.ORG_13);
    }

    @Test
    void should_DeleteJob_When_ValidRequest() {
        var id = "1";
        when(jobRepository.existsById(id)).thenReturn(true);
        when(employeeService.isJobAssigned(id)).thenReturn(new WrapperApiResponse(200, "Success", false, LocalDateTime.now()));

        jobService.deleteJob(id);

        verify(jobRepository).deleteById(id);
    }

    @Test
    void should_ThrowException_When_DeleteJobNotFound() {
        var id = "1";
        when(jobRepository.existsById(id)).thenReturn(false);

        assertThatThrownBy(() -> jobService.deleteJob(id))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage(Constant.ORG_12);
    }

    @Test
    void should_ThrowException_When_DeleteJobAssigned() {
        var id = "1";
        when(jobRepository.existsById(id)).thenReturn(true);
        when(employeeService.isJobAssigned(id)).thenReturn(new WrapperApiResponse(200, "Success", true, LocalDateTime.now()));

        assertThatThrownBy(() -> jobService.deleteJob(id))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage(Constant.ORG_14);
    }

    @Test
    void should_ReturnPagedJobs_When_NoFilters() {
        var pageable = PageRequest.of(0, 10);
        var job = createMockJob("1", "Engineer");
        var page = new PageImpl<>(List.of(job), pageable, 1);
        var filter = new FilterJobRequest(null, null, null);

        when(jobRepository.searchJobs(isNull(), isNull(), isNull(), eq(pageable))).thenReturn(page);

        var result = jobService.getJobs(pageable, filter);

        assertThat(result.items()).hasSize(1);
        assertThat(result.totalItems()).isEqualTo(1);
    }

    @Test
    void should_ReturnPagedJobs_When_NameFilterOnly() {
        var pageable = PageRequest.of(0, 10);
        var job = createMockJob("1", "Engineer");
        var page = new PageImpl<>(List.of(job), pageable, 1);
        var filter = new FilterJobRequest("Eng", null, null);

        when(jobRepository.searchJobs(eq("Eng"), isNull(), isNull(), eq(pageable))).thenReturn(page);

        var result = jobService.getJobs(pageable, filter);

        assertThat(result.items()).hasSize(1);
        verify(jobRepository).searchJobs(eq("Eng"), isNull(), isNull(), any());
    }

    @Test
    void should_ReturnPagedJobs_When_DateFilterOnly() {
        var pageable = PageRequest.of(0, 10);
        var job = createMockJob("1", "Engineer");
        var page = new PageImpl<>(List.of(job), pageable, 1);
        var from = LocalDate.of(2024, 1, 1);
        var to = LocalDate.of(2024, 1, 2);
        var filter = new FilterJobRequest(null, from, to);

        when(jobRepository.searchJobs(isNull(), any(), any(), eq(pageable))).thenReturn(page);

        var result = jobService.getJobs(pageable, filter);

        assertThat(result.items()).hasSize(1);
        verify(jobRepository).searchJobs(isNull(), any(), any(), any());
    }

    @Test
    void should_ReturnPagedJobs_When_AllFilters() {
        var pageable = PageRequest.of(0, 10);
        var job = createMockJob("1", "Engineer");
        var page = new PageImpl<>(List.of(job), pageable, 1);
        var from = LocalDate.of(2024, 1, 1);
        var to = LocalDate.of(2024, 1, 2);
        var filter = new FilterJobRequest("Eng", from, to);

        when(jobRepository.searchJobs(eq("Eng"), any(), any(), eq(pageable))).thenReturn(page);

        var result = jobService.getJobs(pageable, filter);

        assertThat(result.items()).hasSize(1);
        verify(jobRepository).searchJobs(eq("Eng"), any(), any(), any());
    }

    @Test
    void should_ReturnExistence_When_Called() {
        when(jobRepository.existsById("1")).thenReturn(true);
        assertThat(jobService.checkExistence("1")).isTrue();
    }

    private Job createMockJob(String id, String name) {
        var job = new Job();
        ReflectionTestUtils.setField(job, "id", id);
        ReflectionTestUtils.setField(job, "name", name);
        ReflectionTestUtils.setField(job, "createdAt", LocalDateTime.now());
        ReflectionTestUtils.setField(job, "updatedAt", LocalDateTime.now());
        return job;
    }
}
