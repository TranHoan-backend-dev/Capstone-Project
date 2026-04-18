package com.capstone.nawaco.ui.views;

import android.os.Bundle;

import androidx.activity.ComponentActivity;
import androidx.lifecycle.ViewModelProvider;

import com.capstone.nawaco.ui.viewmodel.MediaViewModel;

import dagger.hilt.android.AndroidEntryPoint;

import java.io.File;

/**
 * Activity xử lý giao diện chụp ảnh đồng hồ nước bằng Camera.
 * Sử dụng MediaViewModel để quản lý việc tải ảnh lên GCS và OCR.
 */
@AndroidEntryPoint
public class CameraActivity extends ComponentActivity {

    private MediaViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Khởi tạo MediaViewModel qua ViewModelProvider (cú pháp Java Hilt)
        viewModel = new ViewModelProvider(this).get(MediaViewModel.class);
    }

    /**
     * Phương thức được gọi sau khi hoàn tất chụp ảnh từ Camera API.
     */
    private void onPhotoCaptured(File file) {
        // Gửi file ảnh vừa chụp cho ViewModel để thực hiện quy trình Upload và Lưu URL.
        viewModel.processImage(file);
    }
}
