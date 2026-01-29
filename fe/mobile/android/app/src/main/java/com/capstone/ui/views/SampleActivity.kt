package com.capstone.ui.views

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.lifecycle.repeatOnLifecycle
import com.capstone.ui.viewmodel.SampleViewModel
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch

@AndroidEntryPoint
class SampleActivity : ComponentActivity() {

    private val viewModel: SampleViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Setup UI (vi du voi Jetpack Compose hoac XML)
        // O day chi demo viec quan sat du lieu tu ViewModel
        
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.sampleData.collect { data ->
                    // Cap nhat UI voi danh sach sample data
                    println("Received data: $data")
                }
            }
        }

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.isLoading.collect { isLoading ->
                    // Hien thi hoac an loading indicator
                    println("Is loading: $isLoading")
                }
            }
        }

        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.error.collect { error ->
                    if (error != null) {
                        // Hien thi thong bao loi
                        println("Error: $error")
                    }
                }
            }
        }

        // Goi load data
        viewModel.loadSampleData()
    }
}
