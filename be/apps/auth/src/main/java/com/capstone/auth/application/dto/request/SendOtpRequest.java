package com.capstone.auth.application.dto.request;

import com.capstone.auth.infrastructure.config.Constant;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record SendOtpRequest(
        @NotBlank(message = Constant.PT_01) @Email(message = Constant.PT_01) String email) {
}
