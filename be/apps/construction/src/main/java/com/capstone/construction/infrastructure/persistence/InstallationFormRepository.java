package com.capstone.construction.infrastructure.persistence;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
public interface InstallationFormRepository extends JpaRepository<InstallationForm, InstallationFormId>,
  JpaSpecificationExecutor<InstallationForm> {
  boolean existsById_FormNumberAndId_FormCode(String formNumber, String formCode);

  Page<InstallationForm> findByStatus_ContractAndStatus_Construction(@NonNull ProcessingStatus statusContract, @NonNull ProcessingStatus statusConstruction, Pageable pageable);

  // build dynamic WHERE clause

  /**
   * Specification&lt;T&gt; dung de tao 1 dynamic WHERE clause<br/>
   * - root -> dai dien cho 1 entity<br/>
   * - query -> object dai dien cho query<br/>
   * - cb (CriteriaBuilder) -> tao dieu kien (Predicate)
   *
   * @param keyword tu khoa, tim kiem theo cac truong address, customerName, citizenIdentificationNumber, citizenIdentificationProvideLocation,
   *                phoneNumber, taxCode, bankAccountNumber, bankAccountProviderLocation, usageTarget, householdRegistrationNumber,
   *                customerType
   * @param start   thoi gian bat dau loc. Tinh theo createdAt
   * @param end     thoi gian ket thuc loc. Tinh theo createdAt
   * @return Specification&lt;InstallationForm&gt;
   */
  static @NonNull Specification<InstallationForm> search(
    String keyword, LocalDateTime start, LocalDateTime end,
    ProcessingStatus statusEstimate, ProcessingStatus statusConstruction
  ) {
    return (root, query, cb) -> {
      // tao danh sach cac dieu kien
      List<Predicate> predicates = new ArrayList<>();

      if (keyword != null && !keyword.isBlank()) {
        List<Predicate> orPredicates = new ArrayList<>();
        var lowerCaseKeyword = "%" + keyword.toLowerCase() + "%";
        var unaccent = "unaccent";

        // tuong duong LOWER(address) LIKE %keyword%
        var list = List.of("address", "customerName",
          "citizenIdentificationNumber", "citizenIdentificationProvideLocation",
          "phoneNumber", "taxCode", "bankAccountNumber", "bankAccountProviderLocation",
          "usageTarget", "householdRegistrationNumber", "customerType");

        list.forEach(field ->
          orPredicates.add(cb.like(
            cb.function(unaccent, String.class, cb.lower(cb.function("concat", String.class, cb.literal(""), root.get(field)))),
            cb.function(unaccent, String.class, cb.literal(lowerCaseKeyword))
          )));

        // gop 2 dieu kien tren bang OR
        predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
      }

      if (start != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), start));
      }

      if (end != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), end));
      }

      Expression<String> estimate =
        cb.function(
          "jsonb_extract_path_text",
          String.class,
          root.get("status"),
          cb.literal("estimate")
        );
      Expression<String> construction =
        cb.function(
          "jsonb_extract_path_text",
          String.class,
          root.get("status"),
          cb.literal("construction")
        );

      if (statusConstruction != null && statusEstimate != null) {
        predicates.add(cb.equal(estimate, statusEstimate.name()));
        predicates.add(cb.equal(construction, statusConstruction.name()));
      }

      // gop cac dieu kien bang toan tu AND
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  Boolean existsByNetwork_BranchId(String id);

  @Query(value = """
    SELECT *
    FROM installation_form i
    WHERE i.status->>'registration' <> 'REJECTED'
    """, nativeQuery = true)
  Page<InstallationForm> findAllNotRejectedInstallationForms(Pageable pageable);
}
