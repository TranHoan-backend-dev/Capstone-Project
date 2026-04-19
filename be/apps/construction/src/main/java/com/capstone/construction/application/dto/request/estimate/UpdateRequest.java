package com.capstone.construction.application.dto.request.estimate;

import com.capstone.common.request.BaseMaterial;
import com.capstone.construction.infrastructure.utils.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Schema(description = "Yêu cầu cập nhật dự toán")
public record UpdateRequest(
  GeneralInformation generalInformation,
  List<BaseMaterial> material,

  @Schema(description = "Trạng thái đã hoàn tất hay chưa. Mặc định khi lưu bản nháp thì là false, khi hoàn tất sẽ là true", example = "true")
  @NotNull(message = Message.PT_08)
  Boolean isFinished
) {
  // TODO: Doan nay thong tin dang bi lap voi GeneralInformation cua CostEstimateResponse
  public record GeneralInformation(
    @Schema(description = "Tên khách hàng", example = "Trần Văn A")
    String customerName,

    @Schema(description = "Địa chỉ thi công", example = "123 Đường ABC, Phường X, Quận Y")
    String address,

    @Schema(description = "Ghi chú thêm", example = "Khách hàng yêu cầu lắp nhanh")
    String note,

    @Schema(description = "Phí hợp đồng", example = "2000000")
    @Min(value = 1000, message = "Phí hợp đồng phải lớn hơn 1000 đồng")
    Integer contractFee,

    @Schema(description = "Phí khảo sát", example = "100000")
    @Min(value = 1000, message = "Phí khảo sát phải lớn hơn 1000 đồng")
    Integer surveyFee,

    @Schema(description = "Ngày công khảo sát", example = "1")
    @Min(value = 1, message = "Ngày công khảo sát phải lớn hơn hoặc bằng 1 ngày")
    Integer surveyEffort,

    @Schema(description = "Phí lắp đặt", example = "1500000")
    @Min(value = 1000, message = "Phí lắp đặt phải lớn hơn hoặc bằng 1000 đồng")
    Integer installationFee,

    @Schema(description = "Hệ số nhân công (%)", example = "20")
    @Min(value = 0, message = "Hệ số nhân công phải lớn hơn hoặc bằng 0")
    Double laborCoefficient,

    @Schema(description = "Hệ số chi phí chung (%)", example = "5")
    @Min(value = 0, message = "Hệ số chi phí chung phải lớn hơn hoặc bằng 0")
    Double generalCostCoefficient,

    @Schema(description = "Hệ số thuế tính trước (%)", example = "10")
    @Min(value = 0, message = "Hệ số thuế tính trước phải lớn hơn hoặc bằng 0")
    Double precalculatedTaxCoefficient,

    @Schema(description = "Hệ số máy thi công (%)", example = "0")
    @Min(value = 0, message = "Hệ số máy thi công phải lớn hơn hoặc bằng 0")
    Double constructionMachineryCoefficient,

    @Schema(description = "Hệ số thuế GTGT (VAT) (%)", example = "10")
    @Min(value = 0, message = "Hệ số thuế GTGT phải lớn hơn hoặc bằng 0")
    Double vatCoefficient,

    @Schema(description = "Hệ số thiết kế (%)", example = "2")
    @Min(value = 0, message = "Hệ số thiết kế phải lớn hơn hoặc bằng 0")
    Double designCoefficient,

    @Schema(description = "Phí thiết kế", example = "500000")
    @Min(value = 0, message = "Phí thiết kế phải lớn hơn hoặc bằng 0")
    Integer designFee,

    @Schema(description = "File ảnh thiết kế")
    MultipartFile designImage,

    @Schema(description = "Số sê-ri đồng hồ nước", example = "SN12345678")
    String waterMeterSerial,

    @Schema(description = "Loai dong ho nuoc")
    String waterMeterType,

    @Schema(description = "ID đồng hồ nước tổng", example = "OWM-98765")
    String overallWaterMeterId,

    @Schema(description = "Tổng số tiền của dự toán")
    @NotNull
    @Positive
    BigDecimal totalAmount
  ) {

  }
}
