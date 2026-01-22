package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.Road;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadRepository extends JpaRepository<Road, String> {
}
