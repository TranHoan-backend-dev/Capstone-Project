package com.capstone.device.infrastructure.persistence;

import com.capstone.device.application.dto.response.DeviceManagementHistoryProjection;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// for system logging
@Repository
public class DeviceManagementHistoryRepository {

  @PersistenceContext
  private EntityManager entityManager;

  public List<DeviceManagementHistoryProjection> getDeviceManagementHistory() {
    var sql = """
          SELECT 'ROADMAP' as entity_name, name as item_name, updated_at as operation_time FROM roadmap
          UNION ALL
          SELECT 'LATERAL' as entity_name, name as item_name, updated_at as operation_time FROM laterals
          UNION ALL
          SELECT 'COMMUNE' as entity_name, name as item_name, updated_at as operation_time FROM commune
          UNION ALL
          SELECT 'NEIGHBORHOOD_UNIT' as entity_name, name as item_name, updated_at as operation_time FROM neighborhood_unit
          UNION ALL
          SELECT 'ROAD' as entity_name, name as item_name, updated_at as operation_time FROM road
          UNION ALL
          SELECT 'HAMLET' as entity_name, name as item_name, updated_at as operation_time FROM hamlet
          UNION ALL
          SELECT 'MATERIAL_PRICE' as entity_name, job_content as item_name, updated_at as operation_time FROM material
          UNION ALL
          SELECT 'WATER_METER_TYPE' as entity_name, name as item_name, updated_at as operation_time FROM water_meter_type
          UNION ALL
          SELECT 'MATERIAL_GROUP' as entity_name, name as item_name, updated_at as operation_time FROM materials_group
          UNION ALL
          SELECT 'UNIT' as entity_name, name as item_name, updated_at as operation_time FROM unit
          UNION ALL
          SELECT 'PARAMETER' as entity_name, name as item_name, updated_at as operation_time FROM parameters
          UNION ALL
          SELECT 'WATER_PRICE' as entity_name, description as item_name, updated_at as operation_time FROM water_price
          ORDER BY operation_time DESC
        """;

    Query query = entityManager.createNativeQuery(sql);
    List<Object[]> results = query.getResultList();

    List<DeviceManagementHistoryProjection> projections = new ArrayList<>();
    for (Object[] row : results) {
      projections.add(new DeviceManagementHistoryProjection() {
        @Override
        public String getEntityName() {
          return (String) row[0];
        }

        @Override
        public String getItemName() {
          return (String) row[1];
        }

        @Override
        public LocalDateTime getOperationTime() {
          if (row[2] instanceof Timestamp timestamp) {
            return timestamp.toLocalDateTime();
          }
          return null;
        }
      });
    }

    return projections;
  }
}
