package com.capstone.domain.usecase

import com.capstone.common.utils.Resource
import com.capstone.domain.model.SampleModel
import com.capstone.domain.repository.SampleRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class GetSampleDataUseCase @Inject constructor(
    private val repository: SampleRepository
) {
    suspend operator fun invoke(): Flow<Resource<List<SampleModel>>> = flow {
        emit(Resource.Loading())
        try {
            repository.getSampleData().collect { data ->
                emit(Resource.Success(data))
            }
        } catch (e: Exception) {
            emit(Resource.Error(e.message ?: "An unknown error occurred"))
        }
    }
}
