package com.capstone.data.repository

import com.capstone.data.source.remote.PaymentApi
import com.capstone.data.source.response.WrapperApiResponse
import com.capstone.domain.model.PaymentInfo
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.mockito.Mock
import org.mockito.MockitoAnnotations
import org.mockito.kotlin.whenever

@OptIn(ExperimentalCoroutinesApi::class)
class PaymentRepositoryImplTest {

    @Mock
    private lateinit var api: PaymentApi

    private lateinit var repository: PaymentRepositoryImpl

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        repository = PaymentRepositoryImpl(api)
    }

    @Test
    fun getPayments_ReturnsListFromApi() = runTest {
        val payments = listOf(
            PaymentInfo("1", 100.0, "2024-03-19", true, "Cash")
        )
        val response = WrapperApiResponse(200, "Success", payments, "2024-03-19T00:00:00")
        
        whenever(api.getPayments()).thenReturn(response)
        
        val result = repository.getPayments()
        
        assertEquals(payments, result)
        assertEquals(1, result.size)
        assertEquals("Cash", result[0].paymentMethod)
    }
}
