package com.capstone.data.datasource

import com.capstone.data.source.remote.AuthApi
import com.capstone.data.source.response.UserProfileResponse

class AuthRemoteDataSource(
    private val api: AuthApi
) {
    suspend fun login(accessToken: String): UserProfileResponse {
        val response = api.login("Bearer $accessToken")
        return response.data
    }
}