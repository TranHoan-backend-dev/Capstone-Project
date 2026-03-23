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

    for (int i = 0; i < tiers.size() && remain.compareTo(BigDecimal.ZERO) > 0; i++) {
      var tier = tiers.get(i);
      log.info("Bac gia nuoc {}: {}", i + 1, tier);
      BigDecimal tierVolume;
      if (tier.maxVolume == null) {
        tierVolume = remain;
      } else {
        tierVolume = remain.min(tier.maxVolume);
      }
      log.info("Luong nuoc trong bac gia nay: {}", tierVolume);

      progressiveAmount = progressiveAmount.add(tierVolume.multiply(tier.unitPrice));
      log.info("Tien nuoc trong bac gia nay: {}", progressiveAmount);
      remain = remain.subtract(tierVolume);
      log.info("Luong nuoc con lai: {}", remain);
    }

    var environmentFee = defaultZero(waterPrice.getEnvironmentPrice()).multiply(mass).setScale(SCALE, RoundingMode.HALF_UP);
    log.info("Phi moi truong: {}", environmentFee);

    var beforeTax = progressiveAmount.add(environmentFee);
    log.info("Phi truoc thue: {}", beforeTax);

    log.info("Thue: {}", waterPrice.getTax());
    var taxPercent = defaultZero(waterPrice.getTax());

    var taxAmount = beforeTax.multiply(taxPercent).divide(HUNDRED, SCALE, RoundingMode.HALF_UP);
    var totalAmount = beforeTax.add(taxAmount).setScale(SCALE, RoundingMode.HALF_UP);

    return new WaterChargeBreakdown(
      progressiveAmount.setScale(SCALE, RoundingMode.HALF_UP),
      environmentFee,
      taxAmount,
      totalAmount
    );
  }

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
        } else if (i < rows.size() - 1) {
          // Với bậc giữa nhưng chưa có ngưỡng, fallback 20 để vẫn có lũy tiến.
          maxVolume = new BigDecimal("20");
        }
      }

      tiers.add(new Tier(maxVolume, row.unitPrice));
    }

    return tiers;
  }

  private @Nullable BigDecimal firstNonNull(@NonNull Map<String, BigDecimal> map, @NonNull String... keys) {
    for (String key : keys) {
      if (map.containsKey(key) && map.get(key) != null && map.get(key).compareTo(BigDecimal.ZERO) > 0) {
        return map.get(key);
      }
    }
    return null;
  }

  private BigDecimal defaultZero(BigDecimal value) {
    return value == null ? BigDecimal.ZERO : value;
  }

  private record TierRaw(BigDecimal step, BigDecimal maxVolume, BigDecimal unitPrice) {}

  private record Tier(BigDecimal maxVolume, BigDecimal unitPrice) {}
}

