package com.capstone.device.application.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.List;

@Builder
public record AIResponse(
  String filename,
  @JsonProperty("results")
  List<AIResponseData> results
) {
  public record AIResponseData(
    List<Integer> box,
    LabelType label, // Loai vung duoc phat hien
    String text, //
    Double conf,
    @JsonProperty("yolo_conf")
    Double yoloConf,
    @JsonProperty("ocr_conf")
    Double ocrConf,
    Double heuristic,
    @JsonProperty("final_conf")
    Double finalConf,
    @JsonProperty("raw_texts")
    List<List<Object>> rawTexts // ket qua tho truoc khi duoc xu ly hau ky
  ) {

  }
  public enum LabelType {
    @JsonProperty("meter")
    METER,
    @JsonProperty("Serial_number_region")
    SERIAL_NUMBER_REGION,
    @JsonProperty("Current_pointer_reading_region")
    CURRENT_POINTER_READING_REGION
  }
}
