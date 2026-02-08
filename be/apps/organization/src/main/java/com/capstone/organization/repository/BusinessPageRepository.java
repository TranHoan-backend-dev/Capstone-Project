package com.capstone.organization.repository;

import com.capstone.organization.model.BusinessPage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessPageRepository extends JpaRepository<BusinessPage, String> {
  Page<BusinessPage> findByNameAndActivate(String name, Boolean activate, Pageable pageable);
}
