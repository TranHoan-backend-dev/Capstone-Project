package com.capstone.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.capstone.domain.model.SampleModel
import com.capstone.domain.usecase.GetSampleDataUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SampleViewModel @Inject constructor(
    private val getSampleDataUseCase: GetSampleDataUseCase
) : ViewModel() {

    private val _sampleData = MutableStateFlow<List<SampleModel>>(emptyList())
    val sampleData: StateFlow<List<SampleModel>> = _sampleData.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    fun loadSampleData() {
        viewModelScope.launch {
            getSampleDataUseCase().collect { resource ->
                when (resource) {
                    is com.capstone.common.utils.Resource.Success -> {
                        _sampleData.value = resource.data ?: emptyList()
                        _isLoading.value = false
                    }
                    is com.capstone.common.utils.Resource.Error -> {
                        _error.value = resource.message
                        _isLoading.value = false
                    }
                    is com.capstone.common.utils.Resource.Loading -> {
                        _isLoading.value = true
                    }
                }
            }
        }
    }
}
