package com.capstone.device.domain.repository;

import com.capstone.device.domain.model.Supply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplyRepository extends JpaRepository<Supply, String> {
}

