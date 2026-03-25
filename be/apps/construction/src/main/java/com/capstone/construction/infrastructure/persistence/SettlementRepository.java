package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Settlement;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, String>, JpaSpecificationExecutor<Settlement> {

    @Query("SELECT DISTINCT s FROM Settlement s LEFT JOIN FETCH s.installationForm")
    List<Settlement> findAllWithInstallationForm();

    @Query("SELECT DISTINCT s FROM Settlement s LEFT JOIN FETCH s.installationForm WHERE s.settlementId = :id")
    java.util.Optional<Settlement> findByIdWithInstallationForm(@Param("id") String id);

    static Specification<Settlement> filter(SettlementFilterRequest filterRequest) {
        return (root, query, cb) -> {
            // Join installationForm to avoid null
            root.join("installationForm", jakarta.persistence.criteria.JoinType.LEFT);

            List<Predicate> predicates = new ArrayList<>();

            // Search across multiple fields (jobContent, address, note)
            if (filterRequest.search() != null && !filterRequest.search().isBlank()) {
                var lowerCaseSearch = "%" + filterRequest.search().toLowerCase() + "%";
                var unaccent = "unaccent";
                var searchFields = List.of("jobContent", "address", "note");

                List<Predicate> searchPredicates = new ArrayList<>();
                for (String field : searchFields) {
                    searchPredicates.add(
                        cb.like(
                            cb.function(unaccent, String.class, cb.lower(cb.function("concat", String.class, cb.literal(""), root.get(field)))),
                            cb.function(unaccent, String.class, cb.literal(lowerCaseSearch))
                        )
                    );
                }
                predicates.add(cb.or(searchPredicates.toArray(new Predicate[0])));
            }

            // Filter by status
            if (filterRequest.status() != null && !filterRequest.status().isEmpty()) {
                predicates.add(root.get("status").in(filterRequest.status()));
            }

            // Filter by registration date range
            if (filterRequest.registrationFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("registrationAt"), filterRequest.registrationFrom()));
            }
            if (filterRequest.registrationTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("registrationAt"), filterRequest.registrationTo()));
            }

            // Filter by connection fee range
            if (filterRequest.connectionFeeMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("connectionFee"), filterRequest.connectionFeeMin()));
            }
            if (filterRequest.connectionFeeMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("connectionFee"), filterRequest.connectionFeeMax()));
            }

            // Filter by creation date range
            if (filterRequest.createdAtFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), filterRequest.createdAtFrom()));
            }
            if (filterRequest.createdAtTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), filterRequest.createdAtTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
