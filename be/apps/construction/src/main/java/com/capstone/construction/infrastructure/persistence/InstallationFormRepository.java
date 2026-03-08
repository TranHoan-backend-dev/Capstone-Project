package com.capstone.construction.infrastructure.persistence;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import jakarta.persistence.criteria.Predicate;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Repository
public interface InstallationFormRepository extends JpaRepository<InstallationForm, InstallationFormId>,
  JpaSpecificationExecutor<InstallationForm> {
  boolean existsById_FormNumberOrId_FormCode(String formNumber, String formCode);

  Page<InstallationForm> findByStatus_ContractAndStatus_Construction(@NonNull ProcessingStatus statusContract, @NonNull ProcessingStatus statusConstruction, Pageable pageable);

  // build dynamic WHERE clause

  /**
   * Specification&lt;T&gt; dung de tao 1 dynamic WHERE clause<br/>
   * - root -> dai dien cho 1 entity<br/>
   * - query -> object dai dien cho query<br/>
   * - cb (CriteriaBuilder) -> tao dieu kien (Predicate)
   *
   * @param keyword
   * @param start
   * @param end
   * @return
   */
  static @NonNull Specification<InstallationForm> search(String keyword, LocalDateTime start, LocalDateTime end, ProcessingStatus statusContract, ProcessingStatus statusConstruction) {
    return (root, query, cb) -> {
      // tao danh sach cac dieu kien
      List<Predicate> predicates = new ArrayList<>();

      if (keyword != null && !keyword.isBlank()) {
        // tuong duong LOWER(address) LIKE %keyword%
        Predicate address = cb.like(cb.lower(root.get("address")),
          "%" + keyword.toLowerCase() + "%");

        // tuong duong LOWER(customerName) LIKE %keyword%
        Predicate customer = cb.like(cb.lower(root.get("customerName")),
          "%" + keyword.toLowerCase() + "%");

        // gop 2 dieu kien tren bang OR
        predicates.add(cb.or(address, customer));
      }

      if (start != null && end != null) {
        predicates.add(cb.between(root.get("createdAt"), start, end));
      }

      if (statusConstruction != null && statusContract != null) {
        predicates.add(cb.equal(root.get("status").get("contract"), statusContract));
        predicates.add(cb.equal(root.get("status").get("construction"), statusConstruction));
      }

      // gop cac dieu kien bang toan tu AND
      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }

  Optional<InstallationForm> findById_FormCodeAndId_FormNumber(String idFormCode, String idFormNumber);

  Boolean existsByNetwork_BranchId(String id);
}
