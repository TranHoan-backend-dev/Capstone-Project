import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterInput.styles';

interface MeterInputActionButtonsProps {
  onPrevious: () => void;
  onSave: () => void;
  onNext: () => void;
}

export default function MeterInputActionButtons({
  onPrevious,
  onSave,
  onNext,
}: MeterInputActionButtonsProps) {
  return (
    <View style={styles.bottomButtonsContainer}>
      <View style={styles.bottomButtons}>
        <Button
          mode="contained"
          style={[styles.navButton, styles.leftButton]}
          onPress={onPrevious}
        >
          <Icon name="chevron-left" size={24} color="#fff" />
        </Button>
        <Button
          mode="contained"
          style={styles.saveButton}
          onPress={onSave}
          labelStyle={styles.saveButtonLabel}
        >
          Lưu
        </Button>
        <Button
          mode="contained"
          style={[styles.navButton, styles.rightButton]}
          onPress={onNext}
        >
          <Icon name="chevron-right" size={24} color="#fff" />
        </Button>
      </View>
    </View>
  );
}

