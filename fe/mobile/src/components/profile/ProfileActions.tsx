import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import styles from './styles';

export default function ProfileActions() {
  return (
    <View style={styles.actionsContainer}>
      <Button
        mode="outlined"
        icon="account-edit"
        style={styles.actionButton}
        labelStyle={styles.actionButtonLabel}
      >
        Cập nhật thông tin
      </Button>
    </View>
  );
}
