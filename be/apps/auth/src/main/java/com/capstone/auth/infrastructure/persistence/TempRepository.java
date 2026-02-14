package com.capstone.auth.infrastructure.persistence;

import com.capstone.auth.domain.model.utils.Temp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TempRepository extends JpaRepository<Temp, Integer> {
}
