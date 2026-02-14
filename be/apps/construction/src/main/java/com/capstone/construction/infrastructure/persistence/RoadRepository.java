package com.capstone.construction.infrastructure.persistence;

import com.capstone.construction.domain.model.Road;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoadRepository extends JpaRepository<Road, String> {
    Optional<Road> findByName(String name);

    boolean existsByName(String name);
}
