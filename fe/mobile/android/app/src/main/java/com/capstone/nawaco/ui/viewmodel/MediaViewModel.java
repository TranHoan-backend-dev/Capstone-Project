package com.capstone.ui.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.capstone.domain.repository.MediaRepository;

import dagger.hilt.android.lifecycle.HiltViewModel;

import java.io.File;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.inject.Inject;

@HiltViewModel
public class MediaViewModel extends ViewModel {
    private final MediaRepository mediaRepository;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    private final MutableLiveData<String> uploadedUrl = new MutableLiveData<>(null);
    private final MutableLiveData<String> ocrResult = new MutableLiveData<>(null);
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private final MutableLiveData<String> error = new MutableLiveData<>(null);

    @Inject
    public MediaViewModel(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public LiveData<String> getUploadedUrl() {
        return uploadedUrl;
    }

    public LiveData<String> getOcrResult() {
        return ocrResult;
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public LiveData<String> getError() {
        return error;
    }

    public void processImage(File file) {
        isLoading.setValue(true);
        executor.execute(() -> {
            try {
                String url = mediaRepository.processCapturedImage(file);
                uploadedUrl.postValue(url);
                error.postValue(null);
            } catch (Exception e) {
                error.postValue(e.getMessage());
            } finally {
                isLoading.postValue(false);
            }
        });
    }

    public void performOcr(String url) {
        isLoading.setValue(true);
        executor.execute(() -> {
            try {
                String result = mediaRepository.performOcr(url);
                ocrResult.postValue(result);
                error.postValue(null);
            } catch (Exception e) {
                error.postValue(e.getMessage());
            } finally {
                isLoading.postValue(false);
            }
        });
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        executor.shutdown();
    }
}
