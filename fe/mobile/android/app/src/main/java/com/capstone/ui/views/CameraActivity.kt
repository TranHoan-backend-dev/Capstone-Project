package com.capstone.ui.views

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.viewModels
import com.capstone.ui.viewmodel.MediaViewModel
import dagger.hilt.android.AndroidEntryPoint
import java.io.File

/**
 * Activity xử lý việc chụp ảnh và upload.
 * Kết nối với MediaViewModel để thực hiện nghiệp vụ xử lý ảnh.
 */
@AndroidEntryPoint
class CameraActivity : ComponentActivity() {

    private val viewModel: MediaViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }

    private fun onPhotoCaptured(file: File) {
        // Luồng: Sau khi Camera API trả về file -> Gọi ViewModel để upload
        viewModel.processImage(file)
    }
}
