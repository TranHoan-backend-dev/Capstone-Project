package com.capstone.data.datasource.boundary

import com.capstone.domain.model.SampleModel
import kotlinx.coroutines.flow.Flow

interface SampleRemoteDataSource {
    suspend fun fetchSampleData(): Flow<List<SampleModel>>
}
