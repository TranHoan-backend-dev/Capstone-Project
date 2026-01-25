package com.capstone.data.repository

import com.capstone.data.datasource.boundary.SampleRemoteDataSource
import com.capstone.domain.model.SampleModel
import com.capstone.domain.repository.SampleRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class SampleRepositoryImpl @Inject constructor(
    private val remoteDataSource: SampleRemoteDataSource
) : SampleRepository {
    override suspend fun getSampleData(): Flow<List<SampleModel>> {
        return remoteDataSource.fetchSampleData()
    }
}
