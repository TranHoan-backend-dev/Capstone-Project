import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Text, IconButton, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchCamera } from 'react-native-image-picker';
import { meterService } from '../services/meterService';
import { showToast } from '../utils/toast';

export default function CaptureWaterMeterScreen({ route }: any) {
  const navigation = useNavigation();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isBlurry, setIsBlurry] = useState<boolean | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState(1);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Quyền sử dụng Camera',
            message: 'Ứng dụng cần truy cập camera để chụp ảnh đồng hồ nước.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'Đồng ý',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Từ chối', 'Bạn cần cấp quyền camera để sử dụng chức năng này.');
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'back',
      saveToPhotos: true,
    });

    if (result.didCancel) {
      console.log('User cancelled camera picker');
    } else if (result.errorCode) {
      console.log('Camera Error: ', result.errorMessage);
      Alert.alert('Lỗi', 'Không thể khởi động camera.');
    } else if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (uri) {
        console.log('[CaptureWaterMeterScreen.tsx] photo uri: ' + uri)
        setPhotoUri(uri);
        checkImageQuality();
      }
    }
  };

  const checkImageQuality = () => {
    setIsChecking(true);
    // Giả lập kiểm tra ảnh mờ
    setTimeout(() => {
      const isImageBlurry = Math.random() < 0.3; // 30% tỷ lệ bị mờ
      setIsBlurry(isImageBlurry);
      setIsChecking(false);
    }, 1500);
  };

  const handleRetake = () => {
    setPhotoUri(null);
    setIsBlurry(null);
  };

  const handleManualInput = () => {
    (navigation.navigate as (name: string, params: any) => void)('MeterInput', route.params);
  };

  const handleAccept = async () => {
    if (!photoUri) return;

    try {
      setIsSending(true);

      const { serial, source, totalCustomer } = route.params || {};
      const recordingDate = new Date().toISOString().split('T')[0];

      let response;
      if (source === 'customer' && serial) {
        console.log(`[CaptureWaterMeterScreen.tsx] Calling /analyze/${serial}`);
        response = await meterService.analyzeMeterImageWithSerial(serial, recordingDate, { uri: photoUri });
      } else {
        console.log(`[CaptureWaterMeterScreen.tsx] Calling /analyze (generic)`);
        response = await meterService.analyzeMeterImage(recordingDate, { uri: photoUri });
      }

      console.log("[CaptureWaterMeterScreen.tsx] AI Analyze Response:", response);

      if (totalCustomer && currentCustomerIndex < totalCustomer) {
        showToast.success(`Gửi ảnh thành công! Tiếp tục khách hàng ${currentCustomerIndex + 1}/${totalCustomer}`);

        // Lưu trạng thái đã chụp cục bộ để hiển thị trong Danh sách
        if (route.params?.customerId) {
          try {
            const { localCapturedService } = require('../services/localCapturedService');
            await localCapturedService.markAsCaptured(route.params.customerId);
          } catch (e: any) {
            console.warn('[Capture] Failed to save local state ' + e.message);
          }
        }

        setCurrentCustomerIndex(prev => prev + 1);
        setPhotoUri(null);
        setIsBlurry(null);
      } else {
        showToast.success('Gửi ảnh thành công!');

        // Lưu trạng thái đã chụp cục bộ
        if (route.params?.customerId) {
          try {
            const { localCapturedService } = require('../services/localCapturedService');
            await localCapturedService.markAsCaptured(route.params.customerId);
          } catch (e: any) {
            console.warn('[Capture] Failed to save local state ' + e.message);
          }
        }

        navigation.goBack();
      }
    } catch (error: any) {
      console.error(error.message)
      showToast.error('Gửi ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>
          {route.params?.totalCustomer
            ? `Chụp ảnh (${currentCustomerIndex}/${route.params.totalCustomer})`
            : 'Chụp ảnh đồng hồ'
          }
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.cameraContainer}>
        {!photoUri ? (
          <View style={styles.placeholderCamera}>
            <IconButton icon="camera-outline" size={60} iconColor="#9CA3AF" />
            <Text style={styles.placeholderText}>Nhấn nút chụp bên dưới</Text>
          </View>
        ) : (
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
        )}
      </View>

      <View style={styles.actionsContainer}>
        {isChecking && (
          <View style={styles.checkingContainer}>
            <ActivityIndicator animating={true} color="#1E88E5" size="small" />
            <Text style={styles.statusText}>Đang kiểm tra chất lượng ảnh...</Text>
          </View>
        )}

        {isSending && (
          <View style={styles.checkingContainer}>
            <ActivityIndicator animating={true} color="#10B981" size="small" />
            <Text style={styles.statusText}>Đang gửi ảnh về hệ thống...</Text>
          </View>
        )}

        {!isChecking && !isSending && photoUri && isBlurry === true && (

          <View style={styles.resultContainer}>
            <Text style={styles.errorText}>Ảnh bị mờ đục, chưa đủ tiêu chuẩn!</Text>
            <View style={styles.buttonRow}>
              <Button mode="outlined" onPress={handleRetake} style={styles.flexButton}>
                Chụp lại
              </Button>
              <Button mode="contained" onPress={handleManualInput} style={styles.flexButton}>
                Nhập tay
              </Button>
            </View>
          </View>
        )}

        {!isChecking && !isSending && photoUri && isBlurry === false && (
          <View style={styles.resultContainer}>
            <Text style={styles.successText}>Ảnh rõ nét, đạt tiêu chuẩn.</Text>
            <Button
              mode="contained"
              buttonColor="#10B981"
              onPress={handleAccept}
              style={styles.fullWidthButton}
            >
              Gửi & Tiếp tục
            </Button>
            <Button mode="text" onPress={handleRetake} style={styles.fullWidthButton}>
              Chụp lại
            </Button>
          </View>
        )}

        {!photoUri && (
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 48,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  placeholderCamera: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9CA3AF',
    marginTop: 16,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    minHeight: 200,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1E88E5',
  },
  checkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  statusText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1E40AF',
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  successText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    columnGap: 16,
  },
  flexButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  fullWidthButton: {
    width: '100%',
    marginBottom: 12,
  },
});
