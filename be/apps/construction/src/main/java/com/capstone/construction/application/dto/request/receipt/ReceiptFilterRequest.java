package com.capstone.construction.application.dto.request.receipt;

import com.capstone.common.utils.BaseFilterRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;

public record ReceiptFilterRequest(
    @Schema(description = "Từ khóa tìm kiếm", example = "Nguyễn Văn A")
    String keyword,

    @Schema(description = "Ngày bắt đầu lọc (dd-MM-yyyy)", example = "01-01-2023")
    @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d$")
    String from,

    @Schema(description = "Ngày kết thúc lọc (dd-MM-yyyy)", example = "31-12-2023")
    @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(19|20)\\d\\d$")
    String to,

    @Schema(description = "Trạng thái thanh toán", example = "true")
    Boolean isPaid,

    @Schema(description = "Mã phiếu", example = "PF-2023-001")
    String formCode,

    @Schema(description = "Số phiếu", example = "001")
    String formNumber,

    @Schema(description = "Số biên lai", example = "BL-2023-001")
    String receiptNumber
) {
    public BaseFilterRequest toBaseFilterRequest() {
        return new BaseFilterRequest(keyword, from, to);
    }
}