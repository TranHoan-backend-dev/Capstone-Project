package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.domain.model.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, InstallationFormId> {
}
