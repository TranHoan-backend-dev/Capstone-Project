package com.capstone.device.application.business.usagehistory;

import com.capstone.device.domain.model.PriceType;
import com.capstone.device.domain.model.WaterPrice;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class ProgressiveWaterChargeCalculator implements WaterChargeCalculator {
  private static final int SCALE = 2;
  private static final BigDecimal HUNDRED = new BigDecimal("100");

  /**
   * Tính toán tiền nước theo phương pháp lũy tiến (chia bậc) dựa trên khối lượng nước tiêu thụ.
   * Phương pháp này chia khối lượng nước thành các ngưỡng (ví dụ: 0-10, 10-20...) và áp dụng
   * đơn giá tương ứng cho từng khoảng.
   *
   * @param mass       Khối lượng nước tiêu thụ (m3).
   * @param waterPrice Đối tượng chứa cấu hình giá nước và các bậc lũy tiến.
   * @return Chi tiết các khoản phí bao gồm tiền nước, phí bảo vệ môi trường, thuế và tổng cộng.
   */
  @Override
  public WaterChargeBreakdown calculateProgressiveCharge(BigDecimal mass, WaterPrice waterPrice) {
    if (mass == null || mass.compareTo(BigDecimal.ZERO) <= 0) {
      return new WaterChargeBreakdown(
        BigDecimal.ZERO.setScale(SCALE, RoundingMode.HALF_UP),
        BigDecimal.ZERO.setScale(SCALE, RoundingMode.HALF_UP),
        BigDecimal.ZERO.setScale(SCALE, RoundingMode.HALF_UP),
        BigDecimal.ZERO.setScale(SCALE, RoundingMode.HALF_UP)
      );
    }
    if (waterPrice == null || waterPrice.getPriceTypes() == null || waterPrice.getPriceTypes().isEmpty()) {
      throw new IllegalArgumentException("Không có dữ liệu bậc giá nước để tính tiền");
    }

    var tiers = buildTiers(waterPrice.getPriceTypes().stream()
      .map(PriceType::getPrice)
      .filter(p -> p != null && !p.isEmpty())
      .toList());

    if (tiers.isEmpty()) {
      throw new IllegalArgumentException("Không thể đọc cấu hình bậc giá nước");
    }

    BigDecimal remain = mass;
    BigDecimal progressiveAmount = BigDecimal.ZERO;
    BigDecimal previousThreshold = BigDecimal.ZERO;

    for (int i = 0; i < tiers.size() && remain.compareTo(BigDecimal.ZERO) > 0; i++) {
      var tier = tiers.get(i);
      log.info("Bac gia nuoc {}: {}", i + 1, tier);

      BigDecimal tierVolume;
      if (tier.maxVolume == null) {
        tierVolume = remain;
      } else {
        // Dung lượng của bậc = Ngưỡng hiện tại - Ngưỡng trước đó
        BigDecimal tierCapacity = tier.maxVolume.subtract(previousThreshold);
        if (tierCapacity.compareTo(BigDecimal.ZERO) <= 0) {
          log.warn("Cau hinh bac gia loi: Nguong hien tai ({}) nho hon hoac bang nguong truoc ({})",
            tier.maxVolume, previousThreshold);
          tierVolume = BigDecimal.ZERO;
        } else {
          tierVolume = remain.min(tierCapacity);
        }
        previousThreshold = tier.maxVolume;
      }

      log.info("Luong nuoc trong bac gia nay: {}", tierVolume);

      BigDecimal amountInThisTier = tierVolume.multiply(tier.unitPrice);
      progressiveAmount = progressiveAmount.add(amountInThisTier);

      log.info("Tien nuoc trong bac gia nay: {}", amountInThisTier);
      log.info("Tong tien nuoc luy ke: {}", progressiveAmount);

      remain = remain.subtract(tierVolume);
      log.info("Luong nuoc con lai: {}", remain);
    }

    // 1. Phí bảo vệ môi trường = % Phí BVMT * Tiền nước lũy tiến
    var envPercent = defaultZero(waterPrice.getEnvironmentPrice());
    var environmentFee = progressiveAmount.multiply(envPercent).divide(HUNDRED, SCALE, RoundingMode.HALF_UP);
    log.info("Phi moi truong ({}%): {}", envPercent, environmentFee);

    // 2. Thuế VAT = % Thuế * Tiền nước lũy tiến
    var taxPercent = defaultZero(waterPrice.getTax());
    var taxAmount = progressiveAmount.multiply(taxPercent).divide(HUNDRED, SCALE, RoundingMode.HALF_UP);
    log.info("Thue VAT ({}%): {}", taxPercent, taxAmount);

    // 3. Tổng tiền thực tế cần thu = Tiền nước + Phí BVMT + Thuế VAT
    var totalAmount = progressiveAmount.add(environmentFee).add(taxAmount).setScale(SCALE, RoundingMode.HALF_UP);
    log.info("Tong tien thuc te can thu: {}", totalAmount);

    return new WaterChargeBreakdown(
      progressiveAmount.setScale(SCALE, RoundingMode.HALF_UP),
      environmentFee,
      taxAmount,
      totalAmount
    );
  }

  /**
   * Chuyển đổi dữ liệu cấu hình thô từ database thành danh sách các "Bậc giá" (Tier) có cấu trúc.
   * Phương thức này cũng xử lý logic fallback để tạo ra các ngưỡng mặc định nếu DB thiếu dữ liệu.
   *
   * @param source Danh sách các Map chứa thông tin bậc giá (unitPrice, threshold...).
   * @return Danh sách Tier đã được sắp xếp theo thứ tự các bậc.
   */
  private @NonNull List<Tier> buildTiers(@NonNull List<Map<String, BigDecimal>> source) {
    var rows = new ArrayList<TierRaw>();
    for (Map<String, BigDecimal> item : source) {
      var unitPrice = item.get("price");
      if (unitPrice == null) {
        continue;
      }
      var step = item.get("step");
      var maxVolume = firstNonNull(item, "maxVolume", "max", "limit", "threshold", "volume");
      rows.add(new TierRaw(step, maxVolume, unitPrice));
    }

    rows.sort(Comparator.comparing(r -> r.step == null ? Integer.MAX_VALUE : r.step.intValue()));

    var tiers = new ArrayList<Tier>();
    for (int i = 0; i < rows.size(); i++) {
      var row = rows.get(i);
      BigDecimal maxVolume = row.maxVolume;

      // Nếu không khai báo ngưỡng, dùng mặc định lũy tiến phổ biến:
      // bậc 1: 10m3, bậc 2: 20m3, các bậc còn lại: phần còn lại.
      if (maxVolume == null) {
        if (row.step != null && row.step.intValue() == 1) {
          maxVolume = new BigDecimal("10");
        } else if (row.step != null && row.step.intValue() == 2) {
          maxVolume = new BigDecimal("20");
        } else if (row.step != null && row.step.intValue() == 3) {
          maxVolume = new BigDecimal("30");
        } else if (i < rows.size() - 1) {
          // Fallback tăng dần theo bậc để đảm bảo ngưỡng sau > ngưỡng trước
          maxVolume = new BigDecimal((i + 1) * 10);
        }
      }

      tiers.add(new Tier(maxVolume, row.unitPrice));
    }

    return tiers;
  }

  /**
   * Lấy giá trị BigDecimal đầu tiên không null từ Map dựa trên danh sách các key ưu tiên.
   *
   * @param map  Map chứa dữ liệu cần tìm.
   * @param keys Danh sách các key cần kiểm tra theo thứ tự.
   * @return Giá trị tìm thấy hoặc null nếu không có key nào trùng khớp/không có giá trị > 0.
   */
  private @Nullable BigDecimal firstNonNull(@NonNull Map<String, BigDecimal> map, @NonNull String... keys) {
    for (String key : keys) {
      if (map.containsKey(key) && map.get(key) != null && map.get(key).compareTo(BigDecimal.ZERO) > 0) {
        return map.get(key);
      }
    }
    return null;
  }

  /**
   * Trả về giá trị của BigDecimal hoặc ZERO nếu đầu vào là null.
   *
   * @param value Giá trị cần kiểm tra.
   * @return value nếu không null, ngược lại trả về BigDecimal.ZERO.
   */
  private BigDecimal defaultZero(BigDecimal value) {
    return value == null ? BigDecimal.ZERO : value;
  }

  /**
   * Lớp tạm để chứa dữ liệu thô trước khi xử lý ngưỡng
   */
  private record TierRaw(BigDecimal step, BigDecimal maxVolume, BigDecimal unitPrice) {
  }

  /**
   * Lớp đại diện cho một bậc giá nước với ngưỡng tối đa và đơn giá
   */
  private record Tier(BigDecimal maxVolume, BigDecimal unitPrice) {
  }
}

