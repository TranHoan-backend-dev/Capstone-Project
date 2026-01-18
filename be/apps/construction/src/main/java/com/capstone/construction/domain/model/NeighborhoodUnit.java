package com.capstone.construction.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NeighborhoodUnit {
}
