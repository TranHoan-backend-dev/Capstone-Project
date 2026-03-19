package com.capstone.customer.repository;

import com.capstone.common.utils.SharedConstant;
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

@Repository
public interface ContractRepository extends JpaRepository<WaterUsageContract, String>,
  JpaSpecificationExecutor<WaterUsageContract> {

  static @NonNull Specification<WaterUsageContract> search(String keyword, LocalDateTime start, LocalDateTime end) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (keyword != null && !keyword.isBlank()) {
        var orPredicates = getPredicates(keyword, root, cb);
        predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
      }

      if (start != null && end != null) {
        predicates.add(cb.between(root.get("createdAt"), start, end));
      } else if (start != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), start));
      } else if (end != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), end));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private @NonNull
  static ArrayList<Predicate> getPredicates(@NonNull String keyword, @NonNull Root<WaterUsageContract> root, @NonNull CriteriaBuilder cb) {
    var orPredicates = new ArrayList<Predicate>();
    var lowerCaseKeyword = "%" + keyword.toLowerCase() + "%";

    var list = List.of("contractId", "installationFormId");

    list.forEach(field ->
      orPredicates.add(cb.like(
        cb.function(SharedConstant.UNACCENT, String.class, cb.lower(root.get(field).as(String.class))),
        cb.function(SharedConstant.UNACCENT, String.class, cb.literal(lowerCaseKeyword))
      )));

    // Search by customer name (unaccent)
    orPredicates.add(cb.like(
      cb.function(SharedConstant.UNACCENT, String.class, cb.lower(root.get("customer").get("name").as(String.class))),
      cb.function(SharedConstant.UNACCENT, String.class, cb.literal(lowerCaseKeyword))
    ));

    // Search by customer phone number
    orPredicates.add(cb.like(
      cb.lower(root.get("customer").get("phoneNumber").as(String.class)),
      cb.literal(lowerCaseKeyword)
    ));

    return orPredicates;
  }
}
