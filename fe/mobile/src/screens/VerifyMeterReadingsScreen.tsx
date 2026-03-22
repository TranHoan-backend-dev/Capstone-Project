import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Text, Surface, Button, IconButton, Badge, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface ReviewItem {
  id: string;
  customerName: string;
  meterId: string;
  photoUri: string;
  aiSerialResult: string;
  aiIndexResult: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'manual';
}

const dummyData: ReviewItem[] = [
  {
    id: '1',
    customerName: 'Nguyễn Văn A',
    meterId: '123456',
    photoUri: 'https://via.placeholder.com/600x400?text=anh_dong_ho_1',
    aiSerialResult: 'X1-123456',
    aiIndexResult: '1050',
    isVerified: false,
    status: 'pending',
  },
  {
    id: '2',
    customerName: 'Trần Thị B',
    meterId: '456789',
    photoUri: 'https://via.placeholder.com/600x400?text=anh_dong_ho_2',
    aiSerialResult: 'Y2-456789',
    aiIndexResult: '2210',
    isVerified: false,
    status: 'pending',
  },
];

export default function VerifyMeterReadingsScreen() {
  const navigation = useNavigation();
  const [items, setItems] = useState<ReviewItem[]>(dummyData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [manualSerial, setManualSerial] = useState('');
  const [manualIndex, setManualIndex] = useState('');

  const currentItem = items[currentIndex];

  const handleApprove = () => {
    // Lưu chỉ số vào DB (giả lập)
    Alert.alert('Đã duyệt', `Chỉ số nước của ${currentItem.customerName} đã được lưu.`);
    nextItem();
  };

  const handleManualEdit = () => {
    setIsEditMode(true);
    setManualSerial(currentItem.aiSerialResult);
    setManualIndex(currentItem.aiIndexResult);
  };

  const handleSaveManual = () => {
    // Lưu nhập tay
    Alert.alert('Đã lưu nhập tay', `Dữ liệu của ${currentItem.customerName} đã được cập nhật thủ công.`);
    setIsEditMode(false);
    nextItem();
  };

  const nextItem = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsEditMode(false);
    } else {
      Alert.alert('Hoàn thành', 'Bạn đã duyệt hết tệp ảnh trong ngày.', [
        { text: 'Về trang chủ', onPress: () => navigation.navigate('Home' as never) }
      ]);
    }
  };

  if (!currentItem) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Duyệt ảnh cuối ngày</Text>
        <Badge style={styles.badge}>{currentIndex + 1}/{items.length}</Badge>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.card}>
          <Text style={styles.customerName}>{currentItem.customerName}</Text>
          <Text style={styles.meterId}>Mã ĐD: {currentItem.meterId}</Text>
          <View style={styles.imageContainer}>
            <Image source={{ uri: currentItem.photoUri }} style={styles.image} />
          </View>

          {!isEditMode ? (
            <View style={styles.aiResultContainer}>
              <Text style={styles.sectionTitle}>Kết quả phân tích AI</Text>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Số Serial:</Text>
                <Text style={styles.value}>{currentItem.aiSerialResult}</Text>
              </View>
              <View style={styles.dataRow}>
                <Text style={styles.label}>Chỉ số nước:</Text>
                <Text style={styles.valueHighlight}>{currentItem.aiIndexResult}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.aiResultContainer}>
              <Text style={styles.sectionTitle}>Nhập tay dữ liệu</Text>
              <TextInput
                label="Số Serial"
                value={manualSerial}
                onChangeText={setManualSerial}
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Chỉ số nước mới"
                value={manualIndex}
                onChangeText={setManualIndex}
                style={styles.input}
                keyboardType="numeric"
                mode="outlined"
              />
            </View>
          )}

          <View style={styles.actionButtons}>
            {!isEditMode ? (
              <>
                <Button
                  mode="outlined"
                  onPress={handleManualEdit}
                  style={styles.flexButton}
                  buttonColor="white"
                  textColor="#EF4444"
                >
                  Không ổn định (Nhập tay)
                </Button>
                <Button
                  mode="contained"
                  onPress={handleApprove}
                  style={styles.flexButton}
                  buttonColor="#10B981"
                >
                  Duyệt (OK)
                </Button>
              </>
            ) : (
              <>
                <Button mode="text" onPress={() => setIsEditMode(false)} style={styles.flexButton}>
                  Hủy
                </Button>
                <Button mode="contained" onPress={handleSaveManual} style={styles.flexButton}>
                  Lưu thay đổi
                </Button>
              </>
            )}
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  badge: {
    alignSelf: 'center',
    marginRight: 16,
    backgroundColor: '#3B82F6',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  meterId: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  imageContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#E5E7EB',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  aiResultContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#4B5563',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  valueHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});
