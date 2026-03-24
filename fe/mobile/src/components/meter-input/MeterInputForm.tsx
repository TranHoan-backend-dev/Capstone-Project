import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MeterInputInfoCard from './MeterInputInfoCard';
import MeterInputStatusCard from './MeterInputStatusCard';
import MeterInputIndexCard from './MeterInputIndexCard';
import MeterInputActionButtons from './MeterInputActionButtons';
import ImagePreviewModal from './ImagePreviewModal';
import { meterService, Usage } from '../../services/meterService';
import { storageService } from '../../services/storageService';
import styles from './meterInput.styles';
import { showToast } from '../../utils/toast';



interface MeterInputFormProps {
  customerId?: string;
  customerName?: string;
  address?: string;
  ocrResult?: {
    serial: string;
    currentIndex: number;
    imageUrl: string;
  };
}


export default function MeterInputForm({
  customerId: initialCustomerId = '015281',
  customerName: initialCustomerName = 'Nguyễn Văn Tiến',
  address: initialAddress = '621, Trường Chinh, Phương Nam Định',
  ocrResult,
}: MeterInputFormProps) {

  const navigation = useNavigation<any>();
  const [loading, setLoading] = React.useState(true);
  const [customerData, setCustomerData] = React.useState<any>(null);
  const [_usageHistory, setUsageHistory] = React.useState<Usage[]>([]);


  const [waterType, setWaterType] = useState('Sinh hoạt dân cư');
  const [meterStatus, setMeterStatus] = useState('binh-thuong');
  const [oldIndex, setOldIndex] = useState('0');
  const [newIndex, setNewIndex] = useState('');
  const [m3, setM3] = useState('0');
  const [image, _setImage] = useState<any>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [details, history] = await Promise.all([
        meterService.getCustomerDetails(initialCustomerId),
        meterService.getUsageHistory(initialCustomerId)
      ]);

      setCustomerData(details);

      if (history && history.length > 0) {
        const usages = history[0].usagesList || [];
        setUsageHistory(usages);

        if (usages.length > 0) {
          const lastUsage = usages[usages.length - 1];
          setOldIndex(lastUsage.index.toString());

          // --- BEGIN GOOGLE CLOUD STORAGE INTEGRATION ---
          // const gcsImageUrl = await storageService.getImageUrl(lastUsage.meterImageUrl);
          // if (gcsImageUrl) {
          //   _setImage({ uri: gcsImageUrl });
          // }
          // --- END GOOGLE CLOUD STORAGE INTEGRATION ---

          if (lastUsage.meterImageUrl) {
            _setImage({ uri: lastUsage.meterImageUrl });
          }
        }
      }

      if (details) {
        setWaterType(details.waterPrice?.name || 'Sinh hoạt dân cư');
      }
    } catch (error) {
      console.error('Error fetching meter data:', error);
    } finally {
      setLoading(false);
    }
  }, [initialCustomerId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lắng nghe kết quả từ AI OCR
  useEffect(() => {
    if (ocrResult) {
      const newIdx = ocrResult.currentIndex.toString();
      setNewIndex(newIdx);
      _setImage({ uri: ocrResult.imageUrl });
      
      // Tính toán lại m3 tiêu thụ
      const difference = Math.max(0, parseInt(newIdx, 10) - parseInt(oldIndex || '0', 10));
      setM3(difference.toString());
    }
  }, [ocrResult, oldIndex]);




  const handleNewIndexChange = (value: string) => {
    setNewIndex(value);
    const difference = Math.max(0, parseInt(value || '0', 10) - parseInt(oldIndex || '0', 10));
    setM3(difference.toString());
  };

  const handlePrevious = () => {
    console.log('Go to previous customer');
  };

  const handleSave = async () => {
    if (!newIndex) {
      showToast.error('Vui lòng nhập chỉ số mới');
      return;
    }

    const serial = customerData?.waterMeterId || 'UNKNOWN';

    try {
      setLoading(true);
      await meterService.updateMeterIndex(
        serial,
        parseFloat(newIndex),
        new Date().toISOString().split('T')[0],
        image
      );
      showToast.success('Cập nhật chỉ số thành công');
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleNext = () => {
    console.log('Go to next customer');
  };

  const handleTakePhoto = () => {
    navigation.navigate('CaptureWaterMeter', {
      customerId: initialCustomerId,
      customerName: customerData?.name || initialCustomerName,
      address: customerData?.address || initialAddress,
    });
  };


  const handleViewInvoice = () => {
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
          customerId={customerData?.customerId || initialCustomerId}
          stt={1}
          address={customerData?.address || initialAddress}
          phone={customerData?.phoneNumber || "085..."}
          meterId={customerData?.waterMeterId || "..."}
          waterType={waterType}
          householdNumber={customerData?.numberOfHouseholds?.toString() || "0"}
          populationNumber={customerData?.householdRegistrationNumber?.toString() || "0"}
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
                mode="contained"
                buttonColor="#1E88E5"
                style={styles.cameraButton}
                contentStyle={styles.buttonContent56}
                onPress={handleTakePhoto}
              >
                <Icon name="camera-plus-outline" size={28} color="#fff" />
              </Button>
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
        onPrevious={handlePrevious}
        onSave={handleSave}
        onNext={handleNext}
      />



      <ImagePreviewModal
        visible={showImagePreview}
        imageUri={image}
        onClose={() => setShowImagePreview(false)}
      />
    </View>
  );
}
