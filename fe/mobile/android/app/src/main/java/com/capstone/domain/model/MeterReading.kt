package com.capstone.domain.model

data class MeterReading(
    val id: String = "",
    val serialNumber: String = "",
    val readingValue: Double = 0.0,
    val imagePath: String = "",
    val status: Status = Status.PENDING,
    val aiResult: AiResult? = null,
    val createdAt: Long = System.currentTimeMillis()
) {
    enum class Status {
        PENDING,
        VALIDATED,
        REJECTED,
        COMPLETED
    }

    data class AiResult(
        val serialNumber: String,
        val readingValue: Double,
        val confidence: Float
    )
}
