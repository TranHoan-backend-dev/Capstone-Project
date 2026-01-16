package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.InstallationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstallationFormRepository extends JpaRepository<InstallationForm, String> {
}
