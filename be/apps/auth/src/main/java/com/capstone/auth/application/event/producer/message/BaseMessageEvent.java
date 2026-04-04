package com.capstone.auth.application.event.producer.message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class BaseMessageEvent implements Serializable {
  private String to;
  private String subject;
  private String template;
}
