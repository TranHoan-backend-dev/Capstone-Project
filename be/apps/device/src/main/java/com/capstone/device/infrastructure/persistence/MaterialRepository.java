package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, String> {
    Page<Material> findByJobContentContainingIgnoreCase(String jobContent, Pageable pageable);

    @Query("SELECT m FROM Material m WHERE m.jobContent LIKE %?1% AND m.price BETWEEN ?2 AND ?3")
    Page<Material> findByJobContentContainingIgnoreCaseAndPriceBetween(String jobContent, Double minPrice, Double maxPrice, Pageable pageable);

    @Query("SELECT m FROM Material m WHERE m.price BETWEEN ?1 AND ?2")
    Page<Material> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);
}
