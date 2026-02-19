package com.capstone.construction.application.dto.request.installationform;

import io.swagger.v3.oas.annotations.media.Schema;

public record FilterFormRequest(
    @Schema(description = "Từ khóa tìm kiếm (tên khách hàng, địa chỉ)", example = "Nguyễn Văn A") String keyword,

    @Schema(description = "Ngày bắt đầu lọc (yyyy-MM-dd)", example = "2023-01-01") String from,

    @Schema(description = "Ngày kết thúc lọc (yyyy-MM-dd)", example = "2023-12-31") String to) {
}
