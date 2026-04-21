package com.capstone.construction.infrastructure.persistence;

import com.capstone.common.utils.SharedConstant;
import com.capstone.construction.domain.model.Receipt;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, InstallationFormId>, JpaSpecificationExecutor<Receipt> {
  static @NonNull Specification<Receipt> search(
    String keyword,
    LocalDate start,
    LocalDate end,
    Boolean isPaid,
    String formCode,
    String formNumber,
    String receiptNumber
  ) {
    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      if (keyword != null && !keyword.isBlank()) {
        var orPredicates = getPredicates(keyword, root, cb);
        predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
      }

      if (start != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("paymentDate"), start));
      }

      if (end != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("paymentDate"), end));
      }

      if (isPaid != null) {
        predicates.add(cb.equal(root.get("isPaid"), isPaid));
      }

      if (formCode != null && !formCode.isBlank()) {
        predicates.add(cb.like(
          cb.lower(root.get("installationForm").get("id").get("formCode")),
          "%" + formCode.toLowerCase() + "%"));
      }

      if (formNumber != null && !formNumber.isBlank()) {
        predicates.add(cb.like(
          cb.lower(root.get("installationForm").get("id").get("formNumber")),
          "%" + formNumber.toLowerCase() + "%"));
      }

      if (receiptNumber != null && !receiptNumber.isBlank()) {
        predicates.add(cb.like(
          cb.lower(root.get("receiptNumber")),
          "%" + receiptNumber.toLowerCase() + "%"));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  private static @NonNull ArrayList<Predicate> getPredicates(
    @NonNull String keyword,
    @NonNull Root<Receipt> root,
    @NonNull CriteriaBuilder cb
  ) {
    var orPredicates = new ArrayList<Predicate>();
    var lowerCaseKeyword = "%" + keyword.toLowerCase() + "%";

    var list = List.of("customerName", "address", "receiptNumber");

    list.forEach(field -> orPredicates.add(cb.like(
      cb.function(SharedConstant.UNACCENT, String.class,
        cb.lower(cb.function("concat", String.class, cb.literal(""), root.get(field)))),
      cb.function(SharedConstant.UNACCENT, String.class, cb.literal(lowerCaseKeyword)))));

    return orPredicates;
  }

  Receipt findTopByOrderByCreatedAtDesc();
}
