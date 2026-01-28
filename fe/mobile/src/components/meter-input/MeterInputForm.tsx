import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import MeterInputInfoCard from './MeterInputInfoCard';
import MeterInputStatusCard from './MeterInputStatusCard';
import MeterInputIndexCard from './MeterInputIndexCard';
import MeterInputResultCard from './MeterInputResultCard';
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
  const [waterType, setWaterType] = useState('normal');
  const [meterStatus, setMeterStatus] = useState('binh-thuong');
  const [oldIndex] = useState('621');
  const [newIndex, setNewIndex] = useState('588');
  const [m3, setM3] = useState('4');
  const [amount] = useState('39.560');
  const [image, setImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleCalculateM3 = () => {
    const difference = Math.max(0, parseInt(newIndex) - parseInt(oldIndex));
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
    // Mock: Simulate taking a photo
    setImage('https://via.placeholder.com/400x300?text=Hình+ảnh+định+kiểm');
    console.log('Take photo');
  };

  const handleViewInvoice = () => {
    setShowImagePreview(true);
  };

  const handleImagePress = () => {
    console.log('Select image from gallery');
  };

  return (
    <View style={styles.formContainer}>
      <ScrollView>
        <MeterInputInfoCard
          customerName={customerName}
          customerId={customerId}
          stt={1}
          address={address}
          phone="0854423286"
          meterId="38929"
          meterType="93Vc"
          waterType="Sinh hoạt dân cư"
          householdNumber="0"
          populationNumber="0"
          oldIndex={oldIndex}
        />

        <MeterInputStatusCard value={meterStatus} onStatusChange={setMeterStatus} />

        <MeterInputIndexCard
          oldIndex={oldIndex}
          newIndex={newIndex}
          onNewIndexChange={setNewIndex}
          onCalculate={handleCalculateM3}
        />

      </ScrollView>

      <MeterInputActionButtons
        onTakePhoto={handleTakePhoto}
        onViewInvoice={handleViewInvoice}
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
