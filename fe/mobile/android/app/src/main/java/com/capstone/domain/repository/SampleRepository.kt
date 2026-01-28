package com.capstone.domain.repository

import com.capstone.domain.model.SampleModel
import kotlinx.coroutines.flow.Flow

interface SampleRepository {
    suspend fun getSampleData(): Flow<List<SampleModel>>
}
