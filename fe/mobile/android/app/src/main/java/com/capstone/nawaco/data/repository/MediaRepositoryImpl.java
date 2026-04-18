package com.capstone.nawaco.data.repository;

import com.capstone.nawaco.data.source.remote.GoogleCloudUploader;
import com.capstone.nawaco.data.source.remote.MediaApi;
import com.capstone.nawaco.data.source.request.SaveImageUrlRequest;
import com.capstone.nawaco.domain.repository.MediaRepository;

import java.io.File;

public class MediaRepositoryImpl implements MediaRepository {
    private final MediaApi mediaApi;
    private final GoogleCloudUploader gcsUploader;

    public MediaRepositoryImpl(MediaApi mediaApi, GoogleCloudUploader gcsUploader) {
        this.mediaApi = mediaApi;
        this.gcsUploader = gcsUploader;
    }

    @Override
    public String processCapturedImage(File file) throws Exception {
        // 1. Tải ảnh lên Google Cloud Storage trước
        var gcsUrl = gcsUploader.uploadImage(file);

        // 2. Lưu URL của ảnh vào hệ thống Backend
        mediaApi.saveImageUrl(new SaveImageUrlRequest(gcsUrl, null)).execute();

        return gcsUrl;
    }

    @Override
    public String performOcr(String imageUrl) throws Exception {
        // Placeholder cho chức năng OCR trong tương lai
        return "";
    }
}
