package com.capstone.device.application.business.metertype;

import com.capstone.device.application.dto.request.metertype.CreateRequest;
import com.capstone.device.application.dto.request.metertype.SearchWaterMeterTypeRequest;
import com.capstone.device.application.dto.request.metertype.UpdateRequest;
import com.capstone.device.application.dto.response.PageResponse;
import com.capstone.device.application.dto.response.water.WaterMeterTypeResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MeterTypeService {
    WaterMeterTypeResponse createMeterType(CreateRequest request);

    WaterMeterTypeResponse updateMeterType(String id, UpdateRequest request);

    void deleteMeterType(String id);

    WaterMeterTypeResponse getMeterTypeById(String id);

    PageResponse<WaterMeterTypeResponse> getAllMeterTypes(Pageable pageable);

    PageResponse<WaterMeterTypeResponse> searchMeterTypes(SearchWaterMeterTypeRequest request, Pageable pageable);
}
