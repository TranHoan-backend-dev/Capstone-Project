package com.capstone.customer.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Getter
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class ContractId implements Serializable {
  String contractId;

  String customerId;
}
