import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import common from './common.styles';

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onSave?: () => void;
  onNext?: () => void;
  saveLabel?: string;
}

export default function NavigationButtons({
  onPrevious,
  onSave,
  onNext,
  saveLabel = 'Lưu',
}: NavigationButtonsProps) {
  return (
    <View style={common.bottomButtonsContainer}>
      <View style={common.bottomButtons}>
        {onPrevious && (
          <Button
            mode="contained"
            style={[common.navButton, common.leftButton]}
            onPress={onPrevious}
          >
            <Icon name="chevron-left" size={20} />
          </Button>
        )}
        {onSave && (
          <Button
            mode="contained"
            style={common.saveButton}
            onPress={onSave}
          >
            {saveLabel}
          </Button>
        )}
        {onNext && (
          <Button
            mode="contained"
            style={[common.navButton, common.rightButton]}
            onPress={onNext}
          >
            <Icon name="chevron-right" size={20} />
          </Button>
        )}
      </View>
    </View>
  );
}
