package com.capstone.customer.repository;

import com.capstone.customer.dto.request.ContractFilterRequest;
import com.capstone.customer.model.WaterUsageContract;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface ContractRepository extends JpaRepository<WaterUsageContract, String>,
  JpaSpecificationExecutor<WaterUsageContract> {

  @Query(value = "SELECT contract_id FROM water_usage_contract WHERE contract_id LIKE CONCAT(:prefix, '%') ORDER BY LENGTH(contract_id) DESC, contract_id DESC LIMIT 1", nativeQuery = true)
  String findMaxContractIdByPrefix(@Param("prefix") String prefix);

  @Query("SELECT c.contractId FROM WaterUsageContract c WHERE c.formCode = :formCode AND c.formNumber = :formNumber")
  List<String> findContractIdsByFormCodeAndFormNumber(
    @Param("formCode") String formCode,
    @Param("formNumber") String formNumber
  );

  static @NonNull Specification<WaterUsageContract> filter(ContractFilterRequest request) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      // Handle keyword search across all fields
      if (request.keyword() != null && !request.keyword().isBlank()) {
        var orPredicates = getKeywordPredicates(request.keyword(), root, cb);
        predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
      }

      // Exact match on contractId
      if (request.contractId() != null && !request.contractId().isBlank()) {
        predicates.add(cb.equal(root.get("contractId"), request.contractId()));
      }

      // Exact match on formCode
      if (request.formCode() != null && !request.formCode().isBlank()) {
        predicates.add(cb.equal(root.get("formCode"), request.formCode()));
      }

      // Exact match on formNumber
      if (request.formNumber() != null && !request.formNumber().isBlank()) {
        predicates.add(cb.equal(root.get("formNumber"), request.formNumber()));
      }

      // Exact match on customerId
      if (request.customerId() != null && !request.customerId().isBlank()) {
        predicates.add(cb.equal(root.get("customer").get("customerId"), request.customerId()));
      }

      // Search by customer name (case-insensitive, unaccented)
      if (request.customerName() != null && !request.customerName().isBlank()) {
        var lowerCaseName = "%" + request.customerName().toLowerCase() + "%";
        var unaccent = "unaccent";
        predicates.add(cb.like(
          cb.function(unaccent, String.class, cb.lower(root.get("customer").get("name").as(String.class))),
          cb.function(unaccent, String.class, cb.literal(lowerCaseName))
        ));
      }

      // Search by customer phone number (case-insensitive)
      if (request.customerPhoneNumber() != null && !request.customerPhoneNumber().isBlank()) {
        var lowerCasePhone = "%" + request.customerPhoneNumber().toLowerCase() + "%";
        predicates.add(cb.like(
          cb.lower(root.get("customer").get("phoneNumber").as(String.class)),
          cb.literal(lowerCasePhone)
        ));
      }

      // Handle date range filtering
      if (request.from() != null && !request.from().isBlank()) {
        LocalDateTime startDate = parseDateTime(request.from());
        if (startDate != null) {
          if (request.to() != null && !request.to().isBlank()) {
            LocalDateTime endDate = parseDateTime(request.to());
            if (endDate != null) {
              predicates.add(cb.between(root.get("createdAt"), startDate, endDate));
            } else {
              predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), startDate));
            }
          } else {
            predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), startDate));
          }
        }
      } else if (request.to() != null && !request.to().isBlank()) {
        LocalDateTime endDate = parseDateTime(request.to());
        if (endDate != null) {
          predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), endDate));
        }
      }

      // Handle representatives filtering
      if (request.representatives() != null && !request.representatives().isEmpty()) {
        for (ContractFilterRequest.RepresentativeFilter repFilter : request.representatives()) {
          if (repFilter.name() != null && !repFilter.name().isBlank()) {
            var lowerCaseName = "%" + repFilter.name().toLowerCase() + "%";
            var unaccent = "unaccent";
            predicates.add(cb.like(
              cb.function(unaccent, String.class, cb.lower(root.get("representative").as(String.class))),
              cb.function(unaccent, String.class, cb.literal(lowerCaseName))
            ));
          }
          if (repFilter.position() != null && !repFilter.position().isBlank()) {
            var lowerCasePosition = "%" + repFilter.position().toLowerCase() + "%";
            var unaccent = "unaccent";
            predicates.add(cb.like(
              cb.function(unaccent, String.class, cb.lower(root.get("representative").as(String.class))),
              cb.function(unaccent, String.class, cb.literal(lowerCasePosition))
            ));
          }
        }
      }

      // Handle appendix filtering
      if (request.appendix() != null && !request.appendix().isEmpty()) {
        for (ContractFilterRequest.AppendixFilter appendixFilter : request.appendix()) {
          if (appendixFilter.content() != null && !appendixFilter.content().isBlank()) {
            var lowerCaseContent = "%" + appendixFilter.content().toLowerCase() + "%";
            var unaccent = "unaccent";
            predicates.add(cb.like(
              cb.function(unaccent, String.class, cb.lower(root.get("appendix").as(String.class))),
              cb.function(unaccent, String.class, cb.literal(lowerCaseContent))
            ));
          }
          if (appendixFilter.time() != null && !appendixFilter.time().isBlank()) {
            try {
              LocalDateTime appendixTime = LocalDateTime.parse(appendixFilter.time());
              predicates.add(cb.equal(root.get("appendix").get("time"), appendixTime));
            } catch (Exception e) {
              // Ignore invalid time format
            }
          }
        }
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private static @NonNull List<Predicate> getKeywordPredicates(@NonNull String keyword, @NonNull Root<WaterUsageContract> root, @NonNull CriteriaBuilder cb) {
    var orPredicates = new ArrayList<Predicate>();
    var lowerCaseKeyword = "%" + keyword.toLowerCase() + "%";
    var unaccent = "unaccent";

    // Search in contractId
    orPredicates.add(cb.like(
      cb.function(unaccent, String.class, cb.lower(root.get("contractId").as(String.class))),
      cb.function(unaccent, String.class, cb.literal(lowerCaseKeyword))
    ));

    // Search in formCode
    orPredicates.add(cb.like(
      cb.function(unaccent, String.class, cb.lower(root.get("formCode").as(String.class))),
      cb.function(unaccent, String.class, cb.literal(lowerCaseKeyword))
    ));

    // Search in formNumber
    orPredicates.add(cb.like(
      cb.function(unaccent, String.class, cb.lower(root.get("formNumber").as(String.class))),
      cb.function(unaccent, String.class, cb.literal(lowerCaseKeyword))
    ));

    // Search in customer name (unaccent)
    orPredicates.add(cb.like(
      cb.function(unaccent, String.class, cb.lower(root.get("customer").get("name").as(String.class))),
      cb.function(unaccent, String.class, cb.literal(lowerCaseKeyword))
    ));

    // Search in customer phone number
    orPredicates.add(cb.like(
      cb.lower(root.get("customer").get("phoneNumber").as(String.class)),
      cb.literal(lowerCaseKeyword)
    ));

    // Search in representative (name and position)
    orPredicates.add(cb.like(
      cb.function(unaccent, String.class, cb.lower(root.get("representative").as(String.class))),
      cb.function(unaccent, String.class, cb.literal(lowerCaseKeyword))
    ));

    // Search in appendix (content and time)
    orPredicates.add(cb.like(
      cb.function(unaccent, String.class, cb.lower(root.get("appendix").as(String.class))),
      cb.function(unaccent, String.class, cb.literal(lowerCaseKeyword))
    ));

    return orPredicates;
  }

  private static LocalDateTime parseDateTime(String dateTimeString) {
    if (dateTimeString == null || dateTimeString.isBlank()) {
      return null;
    }
    try {
      return LocalDateTime.parse(dateTimeString, java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss"));
    } catch (Exception e) {
      // Try with date-only format as fallback
      try {
        return java.time.LocalDate.parse(dateTimeString, java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy"))
          .atStartOfDay();
      } catch (Exception ex) {
        return null;
      }
    }
  }
}
