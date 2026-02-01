package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.InstallationForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstallationFormRepository extends JpaRepository<InstallationForm, String> {
    boolean existsByFormNumber(String formNumber);

    Page<InstallationForm> findByHandoverByIsNull(Pageable pageable);

    Page<InstallationForm> findByHandoverByIsNotNull(Pageable pageable);
}
