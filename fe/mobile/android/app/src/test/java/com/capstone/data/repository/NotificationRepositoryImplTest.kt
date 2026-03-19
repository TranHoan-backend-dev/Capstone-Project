package com.capstone.data.repository

import com.capstone.data.source.remote.NotificationApi
import com.capstone.data.source.response.NotificationResponse
import com.capstone.data.source.response.WrapperApiResponse
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.mockito.Mock
import org.mockito.MockitoAnnotations
import org.mockito.kotlin.whenever

@OptIn(ExperimentalCoroutinesApi::class)
class NotificationRepositoryImplTest {

    @Mock
    private lateinit var api: NotificationApi

    private lateinit var repository: NotificationRepositoryImpl

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        repository = NotificationRepositoryImpl(api)
    }

    @Test
    fun getNotifications_Success() = runTest {
        val notificationsRaw = listOf(
            NotificationResponse("1", "link", "msg", true, "2024-03-19")
        )
        val response = WrapperApiResponse(200, "Success", notificationsRaw, "2024-03-19T00:00:00")
        
        whenever(api.getNotifications(0, 10)).thenReturn(response)
        
        val result = repository.getNotifications(0, 10)
        
        assertEquals(1, result.size)
        assertEquals("msg", result[0].message)
        assertEquals(true, result[0].isRead)
    }
}
