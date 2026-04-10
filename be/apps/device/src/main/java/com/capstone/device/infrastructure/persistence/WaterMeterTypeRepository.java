package com.capstone.device.infrastructure.persistence;

import com.capstone.device.application.dto.request.metertype.SearchWaterMeterTypeRequest;
import com.capstone.device.domain.model.WaterMeterType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterMeterTypeRepository extends JpaRepository<WaterMeterType, String> {
  boolean existsByNameIgnoreCase(String name);

//    @Query("SELECT wt FROM WaterMeterType wt WHERE " +
//        "(:search IS NULL OR LOWER(wt.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
//        "LOWER(wt.origin) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
//        "LOWER(wt.meterModel) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
//        "CAST(wt.size AS string) LIKE CONCAT('%', :search, '%') OR " +
//        "LOWER(wt.maxIndex) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
//        "LOWER(wt.qn) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
//        "LOWER(wt.qt) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
//        "LOWER(wt.qmin) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
//        "CAST(wt.diameter AS string) LIKE CONCAT('%', :search, '%'))")
//    Page<WaterMeterType> searchBySearchTerm(@Param("search") String search, Pageable pageable);

  @Query("SELECT wt FROM WaterMeterType wt WHERE " +
    "(:#{#request.name()} IS NULL OR LOWER(wt.name) LIKE LOWER(CONCAT('%', :#{#request.name()}, '%'))) AND " +
    "(:#{#request.origin()} IS NULL OR LOWER(wt.origin) LIKE LOWER(CONCAT('%', :#{#request.origin()}, '%'))) AND " +
    "(:#{#request.meterModel()} IS NULL OR LOWER(wt.meterModel) LIKE LOWER(CONCAT('%', :#{#request.meterModel()}, '%'))) AND " +
    "(:#{#request.size()} IS NULL OR wt.size = :#{#request.size()}) AND " +
    "(:#{#request.maxIndex()} IS NULL OR LOWER(wt.maxIndex) LIKE LOWER(CONCAT('%', :#{#request.maxIndex()}, '%'))) AND " +
    "(:#{#request.qn()} IS NULL OR LOWER(wt.qn) LIKE LOWER(CONCAT('%', :#{#request.qn()}, '%'))) AND " +
    "(:#{#request.qt()} IS NULL OR LOWER(wt.qt) LIKE LOWER(CONCAT('%', :#{#request.qt()}, '%'))) AND " +
    "(:#{#request.qmin()} IS NULL OR LOWER(wt.qmin) LIKE LOWER(CONCAT('%', :#{#request.qmin()}, '%'))) AND " +
    "(:#{#request.diameter()} IS NULL OR wt.diameter = :#{#request.diameter()})")
  Page<WaterMeterType> searchMeterTypes(@Param("request") SearchWaterMeterTypeRequest request, Pageable pageable);

  boolean existsByTypeId(String typeId);
}
