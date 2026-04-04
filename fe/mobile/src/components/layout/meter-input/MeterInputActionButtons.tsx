import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterInput.styles';

interface MeterInputActionButtonsProps {
  onPrevious: () => void;
  onSave: () => void;
  onNext: () => void;
  disabledPrevious?: boolean;
  disabledNext?: boolean;
}

export default function MeterInputActionButtons({
  onPrevious,
  onSave,
  onNext,
  disabledPrevious = false,
  disabledNext = false,
}: MeterInputActionButtonsProps) {
  return (
    <View style={styles.bottomButtonsContainer}>
      <View style={styles.bottomButtons}>
        <Button
          mode="contained"
          style={[styles.navButton, styles.leftButton, disabledPrevious && styles.disabledButton]}
          onPress={onPrevious}
          disabled={disabledPrevious}
        >
          <Icon name="chevron-left" size={24} color={disabledPrevious ? "#A0A0A0" : "#fff"} />
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
          style={[styles.navButton, styles.rightButton, disabledNext && styles.disabledButton]}
          onPress={onNext}
          disabled={disabledNext}
        >
          <Icon name="chevron-right" size={24} color={disabledNext ? "#A0A0A0" : "#fff"} />
        </Button>
      </View>
    </View>
  );
}

