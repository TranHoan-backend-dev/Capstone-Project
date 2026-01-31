package com.capstone.data.source.remote

import com.capstone.data.source.response.NotificationResponse
import com.capstone.data.source.response.WrapperApiResponse
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

interface NotificationApi {
    /**
     * Get paginated notifications
     * Using standard page/size pagination as requested
     */
    @GET("/notification/api/v1/notifications/paginated") // Assumed path for the gateway
    suspend fun getNotifications(
        @Query("page") page: Int,
        @Query("size") size: Int
    ): WrapperApiResponse<List<NotificationResponse>>

    @PUT("/notification/api/v1/notifications/{id}/read")
    suspend fun markAsRead(
        @Path("id") id: String
    ): WrapperApiResponse<Unit?>
}
