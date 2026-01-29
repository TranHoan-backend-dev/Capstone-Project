package com.capstone.data.datasource.impl

import com.capstone.data.datasource.boundary.SampleRemoteDataSource
import com.capstone.domain.model.SampleModel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class SampleRemoteDataSourceImpl @Inject constructor() : SampleRemoteDataSource {
    override suspend fun fetchSampleData(): Flow<List<SampleModel>> = flow {
        // Mo phong viec goi API
        val mockData = listOf(
            SampleModel(1, "Sample 1", "Mo ta cho sample 1"),
            SampleModel(2, "Sample 2", "Mo ta cho sample 2")
        )
        emit(mockData)
    }
}
