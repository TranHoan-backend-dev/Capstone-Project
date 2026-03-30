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
    String label,
    String text,
    @JsonProperty("yolo_conf")
    Double yoloConf,
    @JsonProperty("ocr_conf")
    Double ocrConf,
    Double heuristic,
    @JsonProperty("final_conf")
    Double finalConf,
    @JsonProperty("raw_texts")
    List<List<Object>> rawTexts
  ) {

  }
}
