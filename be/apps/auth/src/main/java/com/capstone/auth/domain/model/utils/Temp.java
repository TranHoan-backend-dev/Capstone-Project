package com.capstone.auth.domain.model.utils;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table
@NoArgsConstructor
@Getter
public class Temp {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Integer id;

  String content;

  public Temp(String content) {
    this.content = content;
  }
}
