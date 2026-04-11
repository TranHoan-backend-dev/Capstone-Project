package com.capstone.construction.domain.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Table
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConstructionRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  String id;

  @Column(nullable = false)
  String contractId;

  @OneToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumns({
    @JoinColumn(name = "installation_form_code", referencedColumnName = "form_code", nullable = false),
    @JoinColumn(name = "installation_form_number", referencedColumnName = "form_number", nullable = false)
  })
  InstallationForm installationForm;

  @Column(nullable = false)
  LocalDateTime createdAt;

  @Column(nullable = false)
  LocalDateTime updatedAt;

  @PrePersist
  void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
