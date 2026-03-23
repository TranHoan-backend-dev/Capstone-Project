package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.Utils;
import com.capstone.device.application.dto.response.MaterialsGroupResponse;
import com.capstone.device.application.usecase.MaterialsGroupUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@AppLog
@RestController
@RequiredArgsConstructor
@RequestMapping("/materials-groups")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Materials Group Controller", description = "Quản lý các nhóm vật tư (Materials Group).")
public class MaterialsGroupController {
  @NonFinal
  Logger log;
  MaterialsGroupUseCase groupUseCase;

  @Operation(summary = "Lấy danh sách nhóm vật tư phân trang", description = "API này cho phép xem danh sách các nhóm vật tư, có hỗ trợ phân trang và lọc theo tên.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lấy danh sách thành công", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MaterialsGroupResponse.class))),
      @ApiResponse(responseCode = "500", description = "Lỗi máy chủ nội bộ", content = @Content(mediaType = "application/json", schema = @Schema(implementation = WrapperApiResponse.class)))
  })
  @GetMapping
  public ResponseEntity<?> getPaginatedListOfGroups(
      @Parameter(description = "Thông tin phân trang (page, size, sort)") @PageableDefault Pageable pageable,
      @Parameter(description = "Từ khóa lọc theo tên nhóm vật tư") @RequestParam(required = false) String filter) {
    log.info("REST request to get paginated list of materials groups: {}, filter: {}", pageable, filter);
    var response = groupUseCase.getMaterialsGroups(pageable, filter);
    return Utils.returnOkResponse("Get paginated list of materials groups successfully", response);
  }
}
