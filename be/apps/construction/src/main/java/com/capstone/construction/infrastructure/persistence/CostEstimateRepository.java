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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

  private @NonNull
  static ArrayList<Predicate> getPredicates(
    @NonNull String keyword, @NonNull Root<CostEstimate> root, @NonNull CriteriaBuilder cb
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

  CostEstimate findByInstallationForm_Id_FormCode(String formCode);
}
