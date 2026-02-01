package com.capstone.domain.repository

import java.io.File

interface MediaRepository {
    suspend fun processCapturedImage(file: File): String
    suspend fun performOcr(imageUrl: String): String
}
