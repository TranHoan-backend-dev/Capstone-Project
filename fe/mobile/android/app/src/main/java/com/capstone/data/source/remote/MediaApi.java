package com.capstone.data.source.remote;

import com.capstone.data.source.request.SaveImageUrlRequest;
import com.capstone.data.source.response.WrapperApiResponse;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface MediaApi {
    @POST("/api/v1/media/save-url")
    Call<WrapperApiResponse<Void>> saveImageUrl(@Body SaveImageUrlRequest request);
}
