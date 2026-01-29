package com.capstone.auth.application.dto.request;

import com.capstone.auth.infrastructure.config.Constant;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record LoginRequest(
        @NotBlank(message = Constant.PT_05) String username,

        @NotBlank(message = Constant.PT_04) String password) {
}
