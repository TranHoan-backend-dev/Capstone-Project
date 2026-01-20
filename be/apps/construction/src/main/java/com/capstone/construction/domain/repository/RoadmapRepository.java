package com.capstone.construction.domain.repository;

import com.capstone.construction.domain.model.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, String> {
}
