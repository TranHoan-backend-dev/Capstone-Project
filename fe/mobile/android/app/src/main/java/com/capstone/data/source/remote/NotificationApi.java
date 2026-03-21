package com.capstone.data.source.remote;

import com.capstone.data.source.response.NotificationResponse;
import com.capstone.data.source.response.WrapperApiResponse;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface NotificationApi {
    @GET("/notification/api/v1/notifications/paginated")
    Call<WrapperApiResponse<List<NotificationResponse>>> getNotifications(
        @Query("page") int page,
        @Query("size") int size
    );

    @PUT("/notification/api/v1/notifications/{id}/read")
    Call<WrapperApiResponse<Void>> markAsRead(@Path("id") String id);
}
