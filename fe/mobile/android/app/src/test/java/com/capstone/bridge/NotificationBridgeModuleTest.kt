package com.capstone.bridge

import com.capstone.domain.model.Notification
import com.capstone.domain.repository.NotificationRepository
import com.capstone.infrastructure.security.PermissionManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.mockito.*
import org.mockito.Mockito.*
import org.mockito.kotlin.*
import java.lang.RuntimeException

@OptIn(ExperimentalCoroutinesApi::class)
class NotificationBridgeModuleTest {

    private val testDispatcher = StandardTestDispatcher()
    
    @Mock private lateinit var repository: NotificationRepository
    @Mock private lateinit var permissionManager: PermissionManager
    @Mock private lateinit var promise: Promise
    @Mock private lateinit var reactContext: ReactApplicationContext

    private lateinit var module: NotificationBridgeModule

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        Dispatchers.setMain(testDispatcher)
        whenever(permissionManager.canAccessFullFeatures()).thenReturn(true)
        module = NotificationBridgeModule(reactContext, repository, permissionManager)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun getNotifications_AccessDenied() = runTest {
        whenever(permissionManager.canAccessFullFeatures()).thenReturn(false)
        
        module.getNotifications(0, 10, promise)
        
        verify(promise).reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
        verifyNoInteractions(repository)
    }

    @Test
    fun getNotifications_Success() = runTest {
        val notifications = listOf(
            Notification("1", "link", "msg", false, "2024-03-19")
        )
        whenever(repository.getNotifications(0, 10)).thenReturn(notifications)
        
        module.getNotifications(0, 10, promise)
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(repository).getNotifications(0, 10)
    }

    @Test
    fun markAsRead_Success() = runTest {
        val id = "123"
        whenever(repository.markAsRead(id)).thenReturn(true)
        
        module.markAsRead(id, promise)
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(promise).resolve(true)
    }
}
