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
      <View style={[styles.actionButtonsContainer, { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, marginBottom: 24 }]}>
        <Button
          mode="contained"
          buttonColor="#1E88E5"
          style={{ width: 48, height: 48, justifyContent: 'center', borderRadius: 8 }}
          contentStyle={{ height: 48, padding: 0 }}
          onPress={onTakePhoto}
        >
          <Icon name="camera-plus-outline" size={24} color="#fff" style={{ margin: 0 }} />
        </Button>
        <Button
          mode="outlined"
          icon="image-outline"
          textColor="#1E88E5"
          style={{ flex: 1, marginLeft: 12, height: 48, justifyContent: 'center', borderColor: '#1E88E5', borderRadius: 8 }}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontSize: 16, fontWeight: '600' }}
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
