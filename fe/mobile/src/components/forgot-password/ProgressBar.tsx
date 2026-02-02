import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './styles';

export default function ProgressBar({ step }: { step: number }) {
  return (
    <View style={styles.progressContainer}>
      <Text style={styles.stepText}>BƯỚC {step} / 3</Text>
      <View style={styles.progressBarContainer}>
        {[1, 2, 3].map(i => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              i <= step && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}
