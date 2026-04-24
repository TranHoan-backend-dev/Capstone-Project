package com.capstone.customer.repository;

import com.capstone.customer.dto.request.customer.CustomerFilterRequest;
import com.capstone.customer.model.Customer;
import jakarta.persistence.criteria.Predicate;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class CustomerSpecification {
  public static @NonNull Specification<Customer> filter(CustomerFilterRequest filter) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (filter == null) {
        return cb.and(predicates.toArray(new Predicate[0]));
      }

      if (filter.search() != null && !filter.search().trim().isEmpty()) {
        var searchPattern = "%" + filter.search().trim().toLowerCase() + "%";
        predicates.add(cb.or(
          cb.like(cb.lower(root.get("name")), searchPattern),
          cb.like(cb.lower(root.get("email")), searchPattern),
          cb.like(cb.lower(root.get("phoneNumber")), searchPattern),
          cb.like(cb.lower(root.get("formCode")), searchPattern),
          cb.like(cb.lower(root.get("waterMeterId")), searchPattern),
          cb.like(cb.lower(root.get("address")), searchPattern)
        ));
      }

      if (filter.roadmapId() != null && !filter.roadmapId().isBlank()) {
        predicates.add(cb.equal(root.get("roadmapId"), filter.roadmapId()));
      }

      if (filter.name() != null && !filter.name().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));
      }
      if (filter.phoneNumber() != null && !filter.phoneNumber().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("phoneNumber")), "%" + filter.phoneNumber().toLowerCase() + "%"));
      }
      if (filter.usageTarget() != null) {
        predicates.add(cb.equal(root.get("usageTarget"), filter.usageTarget()));
      }
      if (filter.isFree() != null) {
        predicates.add(cb.equal(root.get("isFree"), filter.isFree()));
      }
      if (filter.m3Sale() != null && !filter.m3Sale().isBlank()) {
        predicates.add(cb.equal(root.get("m3Sale"), filter.m3Sale()));
      }
      if (filter.waterMeterType() != null && !filter.waterMeterType().isBlank()) {
        predicates.add(cb.equal(root.get("waterMeterType"), filter.waterMeterType()));
      }
      if (filter.citizenIdentificationNumber() != null && !filter.citizenIdentificationNumber().isBlank()) {
        predicates.add(cb.equal(root.get("citizenIdentificationNumber"), filter.citizenIdentificationNumber()));
      }
      if (filter.bankAccountNumber() != null && !filter.bankAccountNumber().isBlank()) {
        predicates.add(cb.equal(root.get("bankAccountNumber"), filter.bankAccountNumber()));
      }
      if (filter.connectionPoint() != null && !filter.connectionPoint().isBlank()) {
        predicates.add(cb.equal(root.get("connectionPoint"), filter.connectionPoint()));
      }
      if (filter.isActive() != null) {
        predicates.add(cb.equal(root.get("isActive"), filter.isActive()));
      }
      if (filter.formNumber() != null && !filter.formNumber().isBlank()) {
        predicates.add(cb.equal(root.get("formNumber"), filter.formNumber()));
      }
      if (filter.formCode() != null && !filter.formCode().isBlank()) {
        predicates.add(cb.equal(root.get("formCode"), filter.formCode()));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
