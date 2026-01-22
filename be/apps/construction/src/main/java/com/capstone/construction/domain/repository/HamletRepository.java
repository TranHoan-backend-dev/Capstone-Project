package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.Hamlet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HamletRepository extends JpaRepository<Hamlet, String> {
}
