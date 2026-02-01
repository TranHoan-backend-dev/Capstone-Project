import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterInput.styles';

interface MeterInputActionButtonsProps {
  onTakePhoto: () => void;
  onViewInvoice: () => void;
  onPrevious: () => void;
  onSave: () => void;
  onNext: () => void;
}

export default function MeterInputActionButtons({
  onTakePhoto,
  onViewInvoice,
  onPrevious,
  onSave,
  onNext,
}: MeterInputActionButtonsProps) {
  return (
    <>
      <View style={styles.actionButtonsContainer}>
        <Button
          mode="contained"
          icon="camera"
          style={styles.actionButton}
          onPress={onTakePhoto}
        >
          Chụp ảnh
        </Button>
        <Button
          mode="contained"
          icon="file-document"
          style={styles.actionButton}
          onPress={onViewInvoice}
        >
          Xem hình ảnh
        </Button>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <View style={styles.bottomButtons}>
          <Button
            mode="contained"
            style={[styles.navButton, styles.leftButton]}
            onPress={onPrevious}
          >
            <Icon name="chevron-left" size={20} />
          </Button>
          <Button
            mode="contained"
            style={styles.saveButton}
            onPress={onSave}
          >
            Lưu
          </Button>
          <Button
            mode="contained"
            style={[styles.navButton, styles.rightButton]}
            onPress={onNext}
          >
            <Icon name="chevron-right" size={20} />
          </Button>
        </View>
      </View>
    </>
  );
}
