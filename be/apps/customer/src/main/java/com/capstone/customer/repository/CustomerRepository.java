package com.capstone.customer.repository;

import com.capstone.customer.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
  boolean existsByWaterPriceId(String waterPriceId);

  boolean existsByFormCodeAndFormNumber(String formCode, String formNumber);

  @Query("SELECT c FROM Customer c WHERE " +
         "(:search IS NULL OR :search = '' OR " +
         "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
         "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
         "LOWER(c.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
         "LOWER(c.formCode) LIKE LOWER(CONCAT('%', :search, '%')))")
  Page<Customer> searchCustomers(@Param("search") String search, Pageable pageable);
}
