package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.Hamlet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HamletRepository extends JpaRepository<Hamlet, String> {
    Optional<Hamlet> findByName(String name);

    boolean existsByName(String name);
}
