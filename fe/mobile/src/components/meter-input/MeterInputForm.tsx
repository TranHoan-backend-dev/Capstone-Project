import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';

import { Card, Text, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MeterInputInfoCard from './MeterInputInfoCard';
import MeterInputStatusCard from './MeterInputStatusCard';
import MeterInputIndexCard from './MeterInputIndexCard';
import MeterInputActionButtons from './MeterInputActionButtons';
import ImagePreviewModal from './ImagePreviewModal';
import { meterService, Usage } from '../../services/meterService';
// import { storageService } from '../../services/storageService';
import styles from './meterInput.styles';
import { showToast } from '../../utils/toast';

interface MeterInputFormProps {
  customerId?: string;
  customerName?: string;
  address?: string;
  stt?: number;
  ocrResult?: {
    serial: string;
    currentIndex: number;
    imageUrl: string;
  };
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function MeterInputForm({
  customerId: initialCustomerId = '015281',
  customerName: initialCustomerName = 'Nguyễn Văn Tiến',
  address: initialAddress = '621, Trường Chinh, Phương Nam Định',
  stt: initialStt = 1,
  ocrResult,
  onNext,
  onPrevious
}: MeterInputFormProps) {

  const [loading, setLoading] = React.useState(true);
  const [customerData, setCustomerData] = React.useState<any>(null);
  const [_usageHistory, setUsageHistory] = React.useState<Usage[]>([]);

  const [waterType, setWaterType] = useState('Sinh hoạt dân cư');
  const [meterStatus, setMeterStatus] = useState('binh-thuong');
  const [oldIndex, setOldIndex] = useState('0');
  const [oldDate, setOldDate] = useState('N/A');
  const [oldMass, setOldMass] = useState('0');
  const [newIndex, setNewIndex] = useState('');
  const [m3, setM3] = useState('0');
  const [image, _setImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Khởi tạo các promise lấy dữ liệu đồng thời (chế độ silent để dùng mock nếu lỗi)
      const [details, recentData, latestImage] = await Promise.all([
        meterService.getCustomerDetails(initialCustomerId, { silent: true }).catch(e => {
          console.warn('Failed to fetch details:', e.message);
          return null;
        }),
        meterService.getRecentUsage(initialCustomerId, { silent: true }).catch(e => {
          console.warn('Failed to fetch usage history:', e.message);
          return null;
        }),
        meterService.getLatestImage(initialCustomerId, { silent: true }).catch(e => {
          console.warn('Failed to fetch latest image:', e.message);
          return null;
        })
      ]);

      // 1. Xử lý Customer Details (Gộp với mock nếu thiếu)
      const finalDetails = {
        customerId: initialCustomerId,
        name: details?.name || initialCustomerName,
        address: details?.address || initialAddress,
        phoneNumber: details?.phoneNumber || '0987.654.321', // Mock
        waterMeterId: details?.waterMeterId || '...',
        numberOfHouseholds: details?.numberOfHouseholds || 1, // Mock
        householdRegistrationNumber: details?.householdRegistrationNumber || 4, // Mock
        waterPrice: details?.waterPrice || { name: 'Sinh hoạt dân cư' } // Mock
      };
      setCustomerData(finalDetails);
      setWaterType(finalDetails.waterPrice?.name || 'Sinh hoạt dân cư');

      // 2. Xử lý Usage History (Lấy 3 tháng gần nhất)
      // Phần này KHÔNG dùng mock nếu API có trả về
      if (recentData && recentData.usagesList && recentData.usagesList.length > 0) {
        setUsageHistory(recentData.usagesList);

        // Sắp xếp lấy bản ghi mới nhất làm chỉ số cũ (oldIndex)
        const sortedUsages = [...recentData.usagesList].sort((a, b) =>
          new Date(b.recordingDate).getTime() - new Date(a.recordingDate).getTime()
        );

        // Resolve Old Index: find the most recent record that is NOT from the current period
        const currentMonthYear = new Date().toISOString().substring(0, 7); // "YYYY-MM"

        let oldIndexRecord = null;
        const previousRecords = sortedUsages.filter(u =>
          !u.recordingDate.startsWith(currentMonthYear)
        );

        if (previousRecords.length > 0) {
          oldIndexRecord = previousRecords[0];
        } else if (sortedUsages.length > 0) {
          oldIndexRecord = sortedUsages[sortedUsages.length - 1]; // Fallback to oldest
        }

        if (oldIndexRecord) {
          setOldIndex(oldIndexRecord.index.toString());
          setOldDate(new Date(oldIndexRecord.recordingDate).toLocaleDateString('vi-VN'));
          setOldMass(oldIndexRecord.mass?.toString() || '0');
        } else {
          setOldIndex("0");
          setOldDate("Chưa có dữ liệu");
          setOldMass("0");
        }

        // Nếu record mới nhất có ảnh, ưu tiên hiển thị
        if (sortedUsages[0]?.meterImageUrl) {
          _setImage(sortedUsages[0].meterImageUrl);
        }
      } else {
        // Dự phòng tối thiểu nếu hoàn toàn trống
        setOldIndex("0");
        setOldDate("N/A");
        setOldMass("0");
      }

      // 3. Xử lý Xem hình ảnh (Uư tiên lấy ảnh mới nhất từ API riêng nếu có)
      if (latestImage) {
        _setImage(latestImage);
      }

      /* --- MOCK DATA FOR DEVELOPMENT (Uncomment to use) ---
      const mockDetails = {
        customerId: initialCustomerId,
        name: initialCustomerName,
        address: initialAddress,
        phoneNumber: '0987.654.321',
        waterMeterId: 'WM-2024-TEST-001',
        numberOfHouseholds: 1,
        householdRegistrationNumber: 4,
        waterPrice: { name: 'Sinh hoạt dân cư' }
      };

      const mockUsageHistory: Usage[] = [
        {
          index: 1245,
          recordingDate: new Date().toISOString(),
          mass: 15,
          price: 150000,
          meterImageUrl: 'https://via.placeholder.com/600x400',
          isPaid: false,
          paymentMethod: null
        }
      ];

      setCustomerData(mockDetails);
      setUsageHistory(mockUsageHistory);
      setOldIndex(mockUsageHistory[0].index.toString());
      setWaterType('Sinh hoạt dân cư');
      _setImage(mockUsageHistory[0].meterImageUrl);
      ---------------------------------------------------- */

    } catch (error) {
      console.error('Error fetching meter data:', error);
      showToast.error('Không thể tải dữ liệu khách hàng. Đang hiển thị dữ liệu mẫu.');
    } finally {
      setLoading(false);
    }
  }, [initialCustomerId, initialCustomerName, initialAddress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lắng nghe kết quả từ AI OCR
  useEffect(() => {
    if (ocrResult) {
      if (ocrResult.currentIndex !== null && ocrResult.currentIndex !== undefined) {
        const newIdx = ocrResult.currentIndex.toString();
        setNewIndex(newIdx);

        // Tính toán lại m3 tiêu thụ
        const difference = Math.max(0, parseInt(newIdx, 10) - parseInt(oldIndex || '0', 10));
        setM3(difference.toString());
      }

      if (ocrResult.imageUrl) {
        _setImage(ocrResult.imageUrl);
      }
    }
  }, [ocrResult, oldIndex]);

  const handleNewIndexChange = (value: string) => {
    setNewIndex(value);
    const difference = Math.max(0, parseInt(value || '0', 10) - parseInt(oldIndex || '0', 10));
    setM3(difference.toString());
  };

  const handlePrevious = () => {
    if (onPrevious) onPrevious();
  };

  const handleSave = async () => {
    if (!newIndex) {
      showToast.error('Vui lòng nhập chỉ số mới');
      return;
    }

    // const serial = customerData?.waterMeterId || 'UNKNOWN';

    try {
      setLoading(true);
      /* Comment out real save
      await meterService.updateMeterIndex(
        serial,
        parseFloat(newIndex),
        new Date().toISOString().split('T')[0],
        image
      );
      */

      console.log('[Mock Save] Saving index:', newIndex);
      await new Promise<void>(resolve => setTimeout(resolve, 1000)); // Giả lập độ trễ

      showToast.success('Cập nhật chỉ số thành công (MOCK)');
      // Refresh data
      // fetchData();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (onNext) onNext();
  };

  const handleViewInvoice = async () => {
    /* Comment out real fetch for on-demand image loading
    try {
      setLoading(true);
      const latestImageUrl = await meterService.getLatestImage(initialCustomerId);
      if (latestImageUrl) {
        _setImage(latestImageUrl);
      }
    } catch (error) {
       console.error("Failed to fetch latest image:", error);
    } finally {
      setLoading(false);
    }
    */
    setShowImagePreview(true);
  };

  return (
    <View style={styles.formContainer}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1E88E5" />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <MeterInputInfoCard
          customerName={customerData?.name || initialCustomerName}
          stt={initialStt}
          address={customerData?.address || initialAddress}
          phone={customerData?.phoneNumber || "085..."}
          meterId={customerData?.waterMeterId || "..."}
          waterType={waterType}
          householdNumber={customerData?.numberOfHouseholds?.toString() || "0"}
          populationNumber={customerData?.householdRegistrationNumber?.toString() || "0"}
          oldIndex={oldIndex}
          oldDate={oldDate}
          oldMass={oldMass}
        />

        <MeterInputStatusCard value={meterStatus} onStatusChange={setMeterStatus} />

        <MeterInputIndexCard
          oldIndex={oldIndex}
          newIndex={newIndex}
          m3={m3}
          onNewIndexChange={handleNewIndexChange}
        />

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon name="note-text-outline" size={20} color="#1E88E5" style={styles.sectionIcon} />
              <Text style={styles.cardTitle}>Ghi chú</Text>
            </View>
            <TextInput
              mode="outlined"
              placeholder="Nhập ghi chú (nếu có)..."
              multiline
              numberOfLines={3}
              style={styles.notesInput}
              outlineColor="#E0E0E0"
              activeOutlineColor="#1E88E5"
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.imageActionCard}>
              <Button
                mode="outlined"
                icon="image-outline"
                textColor="#1E88E5"
                style={styles.viewImageButton}
                contentStyle={styles.buttonContent56}
                labelStyle={styles.viewImageButtonLabel}

                onPress={handleViewInvoice}
              >
                Xem hình ảnh
              </Button>
            </View>
          </Card.Content>
        </Card>

      </ScrollView>

      <MeterInputActionButtons
        onPrevious={onPrevious ? handlePrevious : () => { }}
        onSave={handleSave}
        onNext={onNext ? handleNext : () => { }}
        disabledPrevious={!onPrevious}
        disabledNext={!onNext}
      />

      <ImagePreviewModal
        visible={showImagePreview}
        imageUri={image}
        onClose={() => setShowImagePreview(false)}
      />
    </View>
  );
}
