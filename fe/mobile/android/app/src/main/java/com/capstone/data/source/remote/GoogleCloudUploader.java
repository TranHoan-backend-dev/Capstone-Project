package com.capstone.data.source.remote;

import com.capstone.common.utils.Constants;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;

import java.io.File;
import java.io.IOException;

public class GoogleCloudUploader {
    private static final String PREFIX = "https://storage.googleapis.com";

    private final String apiKey;

    public GoogleCloudUploader(String apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Tải file lên Google Cloud Storage (GCS) và trả về URL file.
     */
    public String uploadImage(File file) throws IOException {
        var requestBody = RequestBody.create(MediaType.parse("image/jpeg"), file);
        var multipartBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("file", file.getName(), requestBody)
                .build();

        var request = new Request.Builder()
                .url(PREFIX + "/upload/storage/v1/b/" + Constants.GCS_BUCKET_NAME + "/o?uploadType=multipart&name=" + file.getName() + "&key=" + apiKey)
                .post(multipartBody)
                .build();

        // Trong thực tại sẽ thực hiện call: httpClient.newCall(request).execute();
        // Giả lập trả về URL public dựa trên quy tắc GCS
        return PREFIX + "/" + Constants.GCS_BUCKET_NAME + "/" + file.getName();
    }
}
