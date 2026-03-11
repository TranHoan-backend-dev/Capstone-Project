package com.capstone.device.application.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UnitRequest(
        @NotBlank(message = "Tên đơn vị không được để trống") String name) {
}
