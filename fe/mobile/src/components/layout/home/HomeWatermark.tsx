import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './home.styles';

export default function HomeWatermark() {
  return (
    <View style={styles.watermark}>
      <Text style={styles.watermarkText}>NAWACO</Text>
    </View>
  );
}
