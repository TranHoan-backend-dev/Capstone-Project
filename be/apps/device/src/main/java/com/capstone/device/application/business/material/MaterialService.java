package com.capstone.device.application.business.material;

import com.capstone.device.application.dto.request.MaterialRequest;
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
    MaterialResponse createMaterial(MaterialRequest request);

    /**
     * Updates an existing material record.
     *
     * @param id      the material ID (labor code)
     * @param request the material update request
     * @return the updated material response
     */
    MaterialResponse updateMaterial(String id, MaterialRequest request);

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

    boolean materialExists(String id);
}
