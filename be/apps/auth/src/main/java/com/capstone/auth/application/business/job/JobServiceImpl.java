package com.capstone.auth.application.business.job;

import com.capstone.common.annotation.AppLog;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobServiceImpl implements JobService {
}
