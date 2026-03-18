package com.capstone.device.application.business.material;

import com.capstone.device.application.dto.request.material.CreateRequest;
import com.capstone.device.application.dto.request.material.UpdateRequest;
import com.capstone.device.application.dto.request.material.SearchRequest;
import com.capstone.device.application.dto.response.MaterialResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaterialService {
  /**
   * Creates a new material record.
   *
   * @param request the material creation request
   * @return the created material response
   */
  MaterialResponse createMaterial(CreateRequest request);

  /**
   * Updates an existing material record.
   *
   * @param id      the material ID (labor code)
   * @param request the material update request
   * @return the updated material response
   */
  MaterialResponse updateMaterial(String id, UpdateRequest request);

  /**
   * Deletes a material record by ID.
   *
   * @param id the material ID
   */
  void deleteMaterial(String id);

  /**
   * Retrieves a material record by ID.
   *
   * @param id the material ID
   * @return the material response
   */
  MaterialResponse getMaterialById(String id);

    /**
     * Retrieves all materials with pagination.
     *
     * @param pageable pagination information
     * @return a page of material responses
     */
    Page<MaterialResponse> getAllMaterials(Pageable pageable);

    /**
     * Searches materials by job content (name) and/or price range.
     *
     * @param searchRequest contains search criteria for jobContent (name) and price range
     * @param pageable pagination information
     * @return a page of material responses matching the search criteria
     */
    Page<MaterialResponse> searchMaterials(SearchRequest searchRequest, Pageable pageable);

  boolean materialExists(String id);

  // material group
  void createGroup(String name);

  void deleteGroup(String id);

  void updateGroup(String id, String name);
}
