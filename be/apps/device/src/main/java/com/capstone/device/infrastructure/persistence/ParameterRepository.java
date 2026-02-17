package com.capstone.device.infrastructure.persistence;

import com.capstone.device.domain.model.Parameters;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParameterRepository extends JpaRepository<Parameters, String> {
  Page<Parameters> findAllByCreatorOrUpdator(String creator, String updator, Pageable pageable);

  Page<Parameters> findAllByNameContainingIgnoreCase(String filter, Pageable pageable);
}
