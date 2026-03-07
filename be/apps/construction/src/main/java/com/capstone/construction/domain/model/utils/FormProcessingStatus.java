package com.capstone.construction.domain.model.utils;

import com.capstone.common.enumerate.ProcessingStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;

@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
public class FormProcessingStatus {

  /**
   * Tóm tắt lại luồng:<br/>
   * Mặc định:<br/>
   * <ul>
   *   <li>registration: PENDING_FOR_APPROVAL</li>
   *   <li>estimate: PROCESSING</li>
   *   <li>contract: PROCESSING</li>
   *   <li>construction: PROCESSING</li>
   * </ul>
   * <br/>
   * Khi trưởng phòng duyệt:<br/>
   * <ul>
   *   <li>registration: APPROVE</li>
   *   <li>estimate: PROCESSING</li>
   *   <li>contract: PROCESSING</li>
   *   <li>construction: PROCESSING</li>
   * </ul>
   * <br/>
   * Khi trưởng phòng duyệt dự toán:<br/>
   * <ul>
   *   <li>registration: APPROVE</li>
   *   <li>estimate: APPROVE</li>
   *   <li>contract: PROCESSING</li>
   *   <li>construction: PROCESSING</li>
   * </ul>
   * <br/>
   * Khi nv lập xong hợp đồng:
   * <ul>
   *   <li>registration: APPROVE</li>
   *   <li>estimate: APPROVE</li>
   *   <li>contract: APPROVE</li>
   *   <li>construction: PROCESSING</li>
   * </ul>
   * <br/>
   * Khi đơn chờ thi công được phân công:
   * <ul>
   *   <li>registration: APPROVE</li>
   *   <li>estimate: APPROVE</li>
   *   <li>contract: APPROVE</li>
   *   <li>construction: PENDING_FOR_APPROVAL</li>
   * </ul>
   * <br/>
   * Khi công trình được nghiệm thu:
   * <ul>
   *   <li>registration: APPROVE</li>
   *   <li>estimate: APPROVE</li>
   *   <li>contract: APPROVE</li>
   *   <li>construction: APPROVE</li>
   * </ul>
   */
  @NonNull
  ProcessingStatus registration;
  @NonNull
  ProcessingStatus estimate;
  @NonNull
  ProcessingStatus contract;
  @NonNull
  ProcessingStatus construction;
}
