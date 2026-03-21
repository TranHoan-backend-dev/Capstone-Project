package com.capstone.device.adapter;

import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.request.UsageHistoryRequest;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/usage")
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Tag(name = "", description = "")
public class UsageHistoryController {
  // dau vao: Anh dong ho, chi so dong ho, so seri
  @PostMapping("/{serial}")
  public ResponseEntity<WrapperApiResponse> updateWaterIndexThisMonth(
    @PathVariable String serial,
    @RequestBody UsageHistoryRequest request
  ) {
    log.info("Updating usage history for serial {}", serial);
    return Utils.returnOkResponse("", null);
  }
}
