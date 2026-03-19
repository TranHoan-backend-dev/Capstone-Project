package com.capstone.bridge

import com.capstone.domain.model.PaymentInfo
import com.capstone.domain.repository.PaymentRepository
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

@OptIn(ExperimentalCoroutinesApi::class)
class PaymentBridgeModuleTest {

    private val testDispatcher = StandardTestDispatcher()
    
    @Mock private lateinit var paymentRepository: PaymentRepository
    @Mock private lateinit var permissionManager: PermissionManager
    @Mock private lateinit var promise: Promise
    @Mock private lateinit var reactContext: ReactApplicationContext

    private lateinit var module: PaymentBridgeModule

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        Dispatchers.setMain(testDispatcher)
        whenever(permissionManager.canAccessFullFeatures()).thenReturn(true)
        module = PaymentBridgeModule(reactContext, paymentRepository, permissionManager)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun getPayments_AccessDenied() = runTest {
        whenever(permissionManager.canAccessFullFeatures()).thenReturn(false)
        
        module.getPayments(promise)
        
        verify(promise).reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
        verifyNoInteractions(paymentRepository)
    }

    @Test
    fun getPayments_Success() = runTest {
        val payments = listOf(
            PaymentInfo("1", 100.0, "2024-03-19", true, "Chuyển khoản", "Thanh toán hoá đơn")
        )
        whenever(paymentRepository.getPayments()).thenReturn(payments)
        
        module.getPayments(promise)
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(paymentRepository).getPayments()
    }

    @Test
    fun getPayments_Error() = runTest {
        val errorMessage = "Network Error"
        whenever(paymentRepository.getPayments()).thenThrow(RuntimeException(errorMessage))
        
        module.getPayments(promise)
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(promise).reject(eq("GET_PAYMENTS_ERROR"), eq(errorMessage), any())
    }
}
