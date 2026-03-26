package com.capstone.domain.usecase;

import com.capstone.common.utils.Result;
import com.capstone.domain.model.MeterReading;
import com.capstone.domain.repository.MeterRepository;

import java.util.List;

import javax.inject.Inject;

/**
 * Use case xử lý quy trình chụp ảnh đồng hồ, xác thực và lưu chỉ số vào hệ thống.
 */
public class VerifyMeterReadingUseCase {
    private final MeterRepository meterRepository;

    @Inject
    public VerifyMeterReadingUseCase(MeterRepository meterRepository) {
        this.meterRepository = meterRepository;
    }

    /**
     * Chụp ảnh và kiểm tra chất lượng ban đầu.
     * Trả về PENDING reading nếu ảnh đủ điều kiện.
     */
    public Result<MeterReading> processCapture() {
        try {
            var file = meterRepository.captureMeterImage();
            if (file == null) {
                return Result.failure(new Exception("Capture failed"));
            }

            var isValid = meterRepository.validateImageQuality(file);
            if (!isValid) {
                return Result.failure(new Exception("Ảnh bị mờ hoặc không đủ tiêu chuẩn. Vui lòng chụp lại."));
            }

            var reading = new MeterReading(file.getAbsolutePath(), MeterReading.Status.PENDING);
            meterRepository.submitToAiProcessing(reading);

            return Result.success(reading);
        } catch (Exception e) {
            return Result.failure(e);
        }
    }

    /**
     * Lấy danh sách ảnh đồng hồ đã chụp trong ngày để kiểm duyệt.
     */
    public List<MeterReading> getReadingsForReview() {
        try {
            return meterRepository.getDailyReadings(System.currentTimeMillis());
        } catch (Exception e) {
            // Error handling or returning empty list
            return List.of();
        }
    }

    /**
     * Xác nhận hoặc hiệu chỉnh chỉ số nước sau khi AI đã nhận diện.
     */
    public boolean finalizeReading(
            MeterReading reading,
            boolean isApproved,
            Double manualValue,
            String manualSerial
    ) {
        MeterReading finalReading;

        if (isApproved && reading.getAiResult() != null) {
            // Duyệt kết quả của AI
            finalReading = reading.copy(
                    reading.getAiResult().getSerialNumber(),
                    reading.getAiResult().getReadingValue(),
                    MeterReading.Status.COMPLETED
            );
        } else {
            // Nhập lại thủ công nếu AI sai hoặc không duyệt
            finalReading = reading.copy(
                    manualSerial != null ? manualSerial : reading.getSerialNumber(),
                    manualValue != null ? manualValue : reading.getReadingValue(),
                    MeterReading.Status.VALIDATED
            );
        }

        try {
            return meterRepository.saveMeterReading(finalReading);
        } catch (Exception e) {
            return false;
        }
    }
}
