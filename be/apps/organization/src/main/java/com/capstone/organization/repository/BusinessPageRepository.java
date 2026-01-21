package com.capstone.organization.repository;

import com.capstone.organization.model.BusinessPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusinessPageRepository extends JpaRepository<BusinessPage, String> {
}
