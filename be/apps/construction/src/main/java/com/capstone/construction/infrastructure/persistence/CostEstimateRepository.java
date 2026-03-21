package com.capstone.construction.infrastructure.persistence;

import com.capstone.common.utils.SharedConstant;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.InstallationForm;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Repository
public interface CostEstimateRepository extends JpaRepository<CostEstimate, String>,
  JpaSpecificationExecutor<CostEstimate> {

  static @NonNull Specification<CostEstimate> search(String keyword, LocalDateTime start, LocalDateTime end) {
    return (root, query, cb) -> {
      // tao danh sach cac dieu kien
      List<Predicate> predicates = new ArrayList<>();

      if (keyword != null && !keyword.isBlank()) {
        var orPredicates = getPredicates(keyword, root, cb);

        // gop 2 dieu kien tren bang OR
        predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
      }

      if (start != null && end != null) {
        predicates.add(cb.between(root.get("createdAt"), start, end));
      }

      // gop cac dieu kien bang toan tu AND
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  static @NonNull Specification<CostEstimate> filterAllFields(Map<String, Object> filters) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (filters == null || filters.isEmpty()) {
        return cb.and();
      }

      filters.forEach((field, value) -> {
        if (value == null || value.toString().isBlank()) {
          return;
        }

        switch (field) {
          case "keyword" -> {
            String keyword = value.toString();
            if (!keyword.isBlank()) {
              var orPredicates = getPredicates(keyword, root, cb);
              predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
            }
          }
          case "from" -> {
            if (value instanceof LocalDate fromDate) {
              predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), fromDate.atStartOfDay()));
            }
          }
          case "to" -> {
            if (value instanceof LocalDate toDate) {
              predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), toDate.atTime(java.time.LocalTime.MAX)));
            }
          }
          case "customerName" -> {
            predicates.add(cb.like(
              cb.function("unaccent", String.class, cb.lower(root.get("customerName"))),
              cb.function("unaccent", String.class, cb.literal("%" + value.toString().toLowerCase() + "%"))
            ));
          }
          case "address" -> {
            predicates.add(cb.like(
              cb.function("unaccent", String.class, cb.lower(root.get("address"))),
              cb.function("unaccent", String.class, cb.literal("%" + value.toString().toLowerCase() + "%"))
            ));
          }
          case "note" -> {
            predicates.add(cb.like(
              cb.function("unaccent", String.class, cb.lower(root.get("note"))),
              cb.function("unaccent", String.class, cb.literal("%" + value.toString().toLowerCase() + "%"))
            ));
          }
          case "contractFee" -> {
            try {
              Integer fee = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("contractFee"), fee));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "surveyFee" -> {
            try {
              Integer fee = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("surveyFee"), fee));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "surveyEffort" -> {
            try {
              Integer effort = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("surveyEffort"), effort));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "installationFee" -> {
            try {
              Integer fee = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("installationFee"), fee));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "laborCoefficient" -> {
            try {
              Integer coef = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("laborCoefficient"), coef));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "generalCostCoefficient" -> {
            try {
              Integer coef = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("generalCostCoefficient"), coef));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "precalculatedTaxCoefficient" -> {
            try {
              Integer coef = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("precalculatedTaxCoefficient"), coef));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "constructionMachineryCoefficient" -> {
            try {
              Integer coef = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("constructionMachineryCoefficient"), coef));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "vatCoefficient" -> {
            try {
              Integer coef = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("vatCoefficient"), coef));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "designCoefficient" -> {
            try {
              Integer coef = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("designCoefficient"), coef));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "designFee" -> {
            try {
              Integer fee = Integer.valueOf(value.toString());
              predicates.add(cb.equal(root.get("designFee"), fee));
            } catch (NumberFormatException e) {
              // Ignore invalid numbers
            }
          }
          case "registrationAt" -> {
            if (value instanceof LocalDate regDate) {
              predicates.add(cb.equal(root.get("registrationAt"), regDate));
            }
          }
          case "createBy" -> {
            predicates.add(cb.like(
              cb.function("unaccent", String.class, cb.lower(root.get("createBy"))),
              cb.function("unaccent", String.class, cb.literal("%" + value.toString().toLowerCase() + "%"))
            ));
          }
          case "waterMeterSerial" -> {
            predicates.add(cb.like(
              cb.function("unaccent", String.class, cb.lower(root.get("waterMeterSerial"))),
              cb.function("unaccent", String.class, cb.literal("%" + value.toString().toLowerCase() + "%"))
            ));
          }
          case "overallWaterMeterId" -> {
            predicates.add(cb.like(
              cb.function("unaccent", String.class, cb.lower(root.get("overallWaterMeterId"))),
              cb.function("unaccent", String.class, cb.literal("%" + value.toString().toLowerCase() + "%"))
            ));
          }
          case "designImageUrl" -> {
            predicates.add(cb.like(
              cb.function("unaccent", String.class, cb.lower(root.get("designImageUrl"))),
              cb.function("unaccent", String.class, cb.literal("%" + value.toString().toLowerCase() + "%"))
            ));
          }
        }
      });

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

private @NonNull
  static ArrayList<Predicate> getPredicates(@NonNull String keyword, @NonNull Root<CostEstimate> root, @NonNull CriteriaBuilder cb) {
  private @NonNull
  static ArrayList<Predicate> getPredicates(
    @NonNull String keyword, @NonNull Root<CostEstimate> root,
    @NonNull CriteriaBuilder cb
  ) {
    var orPredicates = new ArrayList<Predicate>();
    var lowerCaseKeyword = "%" + keyword.toLowerCase() + "%";

    // tuong duong LOWER(address) LIKE %keyword%
    var list = List.of("address", "customerName", "note", "designImageUrl", "waterMeterSerial");

    list.forEach(field -> orPredicates.add(cb.like(
      cb.function(SharedConstant.UNACCENT, String.class,
        cb.lower(cb.function("concat", String.class, cb.literal(""), root.get(field)))),
      cb.function(SharedConstant.UNACCENT, String.class, cb.literal(lowerCaseKeyword)))));
    return orPredicates;
  }

  Boolean existsByInstallationForm(InstallationForm installationForm);

  Optional<CostEstimate> findByInstallationForm(InstallationForm installationForm);
}