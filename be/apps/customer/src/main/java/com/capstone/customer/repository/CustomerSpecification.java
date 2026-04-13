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
        String searchPattern = "%" + filter.search().trim().toLowerCase() + "%";
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
      if (filter.address() != null && !filter.address().isBlank()) {
        predicates.add(cb.like(cb.lower(root.join("bill").get("exportAddress")), "%" + filter.address().toLowerCase() + "%"));
      }

      if (filter.name() != null && !filter.name().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("name")), "%" + filter.name().toLowerCase() + "%"));
      }
      if (filter.email() != null && !filter.email().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("email")), "%" + filter.email().toLowerCase() + "%"));
      }
      if (filter.phoneNumber() != null && !filter.phoneNumber().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("phoneNumber")), "%" + filter.phoneNumber().toLowerCase() + "%"));
      }
      if (filter.type() != null) {
        predicates.add(cb.equal(root.get("type"), filter.type()));
      }
      if (filter.isBigCustomer() != null) {
        predicates.add(cb.equal(root.get("isBigCustomer"), filter.isBigCustomer()));
      }
      if (filter.usageTarget() != null) {
        predicates.add(cb.equal(root.get("usageTarget"), filter.usageTarget()));
      }
      if (filter.numberOfHouseholds() != null) {
        predicates.add(cb.equal(root.get("numberOfHouseholds"), filter.numberOfHouseholds()));
      }
      if (filter.householdRegistrationNumber() != null) {
        predicates.add(cb.equal(root.get("householdRegistrationNumber"), filter.householdRegistrationNumber()));
      }
      if (filter.protectEnvironmentFee() != null) {
        predicates.add(cb.equal(root.get("protectEnvironmentFee"), filter.protectEnvironmentFee()));
      }
      if (filter.isFree() != null) {
        predicates.add(cb.equal(root.get("isFree"), filter.isFree()));
      }
      if (filter.isSale() != null) {
        predicates.add(cb.equal(root.get("isSale"), filter.isSale()));
      }
      if (filter.m3Sale() != null && !filter.m3Sale().isBlank()) {
        predicates.add(cb.equal(root.get("m3Sale"), filter.m3Sale()));
      }
      if (filter.fixRate() != null && !filter.fixRate().isBlank()) {
        predicates.add(cb.equal(root.get("fixRate"), filter.fixRate()));
      }
      if (filter.installationFee() != null) {
        predicates.add(cb.equal(root.get("installationFee"), filter.installationFee()));
      }
      if (filter.deductionPeriod() != null && !filter.deductionPeriod().isBlank()) {
        predicates.add(cb.equal(root.get("deductionPeriod"), filter.deductionPeriod()));
      }
      if (filter.monthlyRent() != null) {
        predicates.add(cb.equal(root.get("monthlyRent"), filter.monthlyRent()));
      }
      if (filter.waterMeterType() != null && !filter.waterMeterType().isBlank()) {
        predicates.add(cb.equal(root.get("waterMeterType"), filter.waterMeterType()));
      }
      if (filter.citizenIdentificationNumber() != null && !filter.citizenIdentificationNumber().isBlank()) {
        predicates.add(cb.equal(root.get("citizenIdentificationNumber"), filter.citizenIdentificationNumber()));
      }
      if (filter.citizenIdentificationProvideAt() != null && !filter.citizenIdentificationProvideAt().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("citizenIdentificationProvideAt")), "%" + filter.citizenIdentificationProvideAt().toLowerCase() + "%"));
      }
      if (filter.paymentMethod() != null && !filter.paymentMethod().isBlank()) {
        predicates.add(cb.equal(root.get("paymentMethod"), filter.paymentMethod()));
      }
      if (filter.bankAccountNumber() != null && !filter.bankAccountNumber().isBlank()) {
        predicates.add(cb.equal(root.get("bankAccountNumber"), filter.bankAccountNumber()));
      }
      if (filter.bankAccountProviderLocation() != null && !filter.bankAccountProviderLocation().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("bankAccountProviderLocation")), "%" + filter.bankAccountProviderLocation().toLowerCase() + "%"));
      }
      if (filter.bankAccountName() != null && !filter.bankAccountName().isBlank()) {
        predicates.add(cb.like(cb.lower(root.get("bankAccountName")), "%" + filter.bankAccountName().toLowerCase() + "%"));
      }
      if (filter.budgetRelationshipCode() != null && !filter.budgetRelationshipCode().isBlank()) {
        predicates.add(cb.equal(root.get("budgetRelationshipCode"), filter.budgetRelationshipCode()));
      }
      if (filter.passportCode() != null && !filter.passportCode().isBlank()) {
        predicates.add(cb.equal(root.get("passportCode"), filter.passportCode()));
      }
      if (filter.connectionPoint() != null && !filter.connectionPoint().isBlank()) {
        predicates.add(cb.equal(root.get("connectionPoint"), filter.connectionPoint()));
      }
      if (filter.isActive() != null) {
        predicates.add(cb.equal(root.get("isActive"), filter.isActive()));
      }
      if (filter.cancelReason() != null && !filter.cancelReason().isBlank()) {
        predicates.add(cb.equal(root.get("cancelReason"), filter.cancelReason()));
      }
      if (filter.formNumber() != null && !filter.formNumber().isBlank()) {
        predicates.add(cb.equal(root.get("formNumber"), filter.formNumber()));
      }
      if (filter.formCode() != null && !filter.formCode().isBlank()) {
        predicates.add(cb.equal(root.get("formCode"), filter.formCode()));
      }
      if (filter.waterPriceId() != null && !filter.waterPriceId().isBlank()) {
        predicates.add(cb.equal(root.get("waterPriceId"), filter.waterPriceId()));
      }
      if (filter.waterMeterId() != null && !filter.waterMeterId().isBlank()) {
        predicates.add(cb.equal(root.get("waterMeterId"), filter.waterMeterId()));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
