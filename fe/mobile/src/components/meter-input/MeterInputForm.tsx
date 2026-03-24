import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MeterInputInfoCard from './MeterInputInfoCard';
import MeterInputStatusCard from './MeterInputStatusCard';
import MeterInputIndexCard from './MeterInputIndexCard';
import MeterInputActionButtons from './MeterInputActionButtons';
import ImagePreviewModal from './ImagePreviewModal';
import styles from './meterInput.styles';


interface MeterInputFormProps {
  customerId?: string;
  customerName?: string;
  address?: string;
}

export default function MeterInputForm({
  customerId = '015281',
  customerName = 'Nguyễn Văn Tiến',
  address = '621, Trường Chinh, Phương Nam Định',
}: MeterInputFormProps) {
  const navigation = useNavigation<any>();
  const [waterType] = useState('normal');
  const [meterStatus, setMeterStatus] = useState('binh-thuong');
  const [oldIndex] = useState('621');
  const [newIndex, setNewIndex] = useState('588');
  const [m3, setM3] = useState('4');
  const [image] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleNewIndexChange = (value: string) => {
    setNewIndex(value);
    const difference = Math.max(0, parseInt(value || '0', 10) - parseInt(oldIndex || '0', 10));
    setM3(difference.toString());
  };

  const handlePrevious = () => {
    console.log('Go to previous customer');
  };

  const handleSave = () => {
    console.log('Save meter input', {
      customerId,
      waterType,
      meterStatus,
      oldIndex,
      newIndex,
      m3,
      image,
    });
  };

  const handleNext = () => {
    console.log('Go to next customer');
  };

  const handleTakePhoto = () => {
    navigation.navigate('CaptureWaterMeter', {
      customerId,
      customerName,
      address,
    });
  };

  const handleViewInvoice = () => {
    setShowImagePreview(true);
  };

  return (
    <View style={styles.formContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MeterInputInfoCard
          customerName={customerName}
          customerId={customerId}
          stt={1}
          address={address}
          phone="0854423286"
          meterId="38929"
          waterType="Sinh hoạt dân cư"
          householdNumber="0"
          populationNumber="0"
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
