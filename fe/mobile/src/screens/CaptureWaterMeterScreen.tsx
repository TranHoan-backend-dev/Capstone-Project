import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function CaptureWaterMeterScreen({ route }: any) {
  const navigation = useNavigation();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isBlurry, setIsBlurry] = useState<boolean | null>(null);

  const takePhoto = () => {
    // Giả lập chụp ảnh
    setPhotoUri('https://via.placeholder.com/600x800?text=anh_dong_ho_nuoc');
    checkImageQuality();
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
    navigation.navigate('MeterInput' as never, route.params as never);
  };

  const handleAccept = () => {
    Alert.alert(
      'Gửi thành công',
      'Ảnh đã được nhận và đang gửi đi để AI phân tích bất đồng bộ.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Chụp ảnh đồng hồ</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.cameraContainer}>
        {!photoUri ? (
          <View style={styles.placeholderCamera}>
            <IconButton icon="camera-outline" size={60} color="#9CA3AF" />
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

        {!isChecking && photoUri && isBlurry === true && (
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

        {!isChecking && photoUri && isBlurry === false && (
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
