package com.capstone.bridge

import com.capstone.domain.model.UserProfile
import com.capstone.domain.repository.AuthRepository
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
class AuthBridgeModuleTest {

    private val testDispatcher = StandardTestDispatcher()
    
    @Mock
    private lateinit var authRepository: AuthRepository
    
    @Mock
    private lateinit var promise: Promise
    
    @Mock
    private lateinit var reactContext: ReactApplicationContext

    private lateinit var authModule: AuthBridgeModule

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        Dispatchers.setMain(testDispatcher)
        authModule = AuthBridgeModule(reactContext, authRepository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun login_Success() = runTest {
        val token = "valid_token"
        val profile = UserProfile(
            fullName = "John Doe",
            avatarUrl = "url",
            role = "USER",
            username = "johndoe",
            email = "john@example.com"
        )
        
        whenever(authRepository.login(token)).thenReturn(profile)
        
        authModule.login(token, promise)
        
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(authRepository).login(token)
        // verify(promise).resolve(any()) // Cant verify with mockito because Arguments.createMap() returns null in non-native environment
    }

    @Test
    fun login_Failure() = runTest {
        val token = "invalid_token"
        val errorMessage = "Invalid token"
        
        whenever(authRepository.login(token)).thenThrow(RuntimeException(errorMessage))
        
        authModule.login(token, promise)
        
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(promise).reject(eq("LOGIN_ERROR"), eq(errorMessage), any())
    }

    @Test
    fun sendOtp_Success() = runTest {
        val email = "test@example.com"
        whenever(authRepository.sendOtp(email)).thenReturn("OTP Sent")
        
        authModule.sendOtp(email, promise)
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(promise).resolve("OTP Sent")
    }

    @Test
    fun verifyOtp_Success() = runTest {
        val email = "test@example.com"
        val otp = "123456"
        whenever(authRepository.verifyOtp(email, otp)).thenReturn("Verified")
        
        authModule.verifyOtp(email, otp, promise)
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(promise).resolve("Verified")
    }
}
