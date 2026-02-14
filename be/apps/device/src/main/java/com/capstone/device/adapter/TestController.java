package com.capstone.device.adapter;

import com.capstone.common.annotation.AppLog;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AppLog
@RestController
@RequestMapping("/")
public class TestController {
  private Logger log;

  @GetMapping("/health")
  public String index() {
    log.info("/health");
    return "OK";
  }
}
