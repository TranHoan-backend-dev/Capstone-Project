package com.capstone.bridge

import com.capstone.domain.repository.MeterRepository
import com.capstone.infrastructure.security.PermissionManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
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
class MeterBridgeModuleTest {

    private val testDispatcher = StandardTestDispatcher()
    
    @Mock private lateinit var meterRepository: MeterRepository
    @Mock private lateinit var permissionManager: PermissionManager
    @Mock private lateinit var promise: Promise
    @Mock private lateinit var reactContext: ReactApplicationContext
    @Mock private lateinit var readingMap: ReadableMap

    private lateinit var module: MeterBridgeModule

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        Dispatchers.setMain(testDispatcher)
        whenever(permissionManager.canAccessFullFeatures()).thenReturn(true)
        module = MeterBridgeModule(reactContext, meterRepository, permissionManager)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun updateManualMeterReading_AccessDenied() = runTest {
        whenever(permissionManager.canAccessFullFeatures()).thenReturn(false)
        
        module.updateManualMeterReading("1", "SN123", 15.5, promise)
        
        verify(promise).reject("ACCESS_DENIED", "Bạn không có quyền thực hiện chức năng này")
        verifyNoInteractions(meterRepository)
    }

    @Test
    fun updateManualMeterReading_Success() = runTest {
        val id = "123"
        val sn = "SN123"
        val val_ = 100.5
        whenever(meterRepository.updateManualMeterReading(id, sn, val_)).thenReturn(true)
        
        module.updateManualMeterReading(id, sn, val_, promise)
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(meterRepository).updateManualMeterReading(id, sn, val_)
        verify(promise).resolve(true)
    }

    @Test
    fun saveMeterReading_Success() = runTest {
        whenever(readingMap.getString("id")).thenReturn("123")
        whenever(readingMap.getString("serialNumber")).thenReturn("SN123")
        whenever(readingMap.getDouble("readingValue")).thenReturn(100.0)
        whenever(readingMap.getString("imagePath")).thenReturn("path")
        
        whenever(meterRepository.saveMeterReading(any())).thenReturn(true)
        
        module.saveMeterReading(readingMap, promise)
        testDispatcher.scheduler.advanceUntilIdle()
        
        verify(meterRepository).saveMeterReading(any())
        verify(promise).resolve(true)
    }
}
