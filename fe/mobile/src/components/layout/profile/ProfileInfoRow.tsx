import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import styles from './styles';

type Props = {
  leftLabel: string;
  leftValue?: string;
  rightLabel: string;
  rightValue?: string;
  rightComponent?: React.ReactNode;
  strongLeft?: boolean;
};

export default function ProfileInfoRow({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  rightComponent,
  strongLeft,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <Text style={styles.label}>{leftLabel}</Text>
        {leftValue && (
          <Text style={strongLeft ? styles.valueStrong : styles.value}>
            {leftValue}
          </Text>
        )}
      </View>

      <View style={styles.column}>
        <Text style={styles.label}>{rightLabel}</Text>
        {rightComponent ?? (
          <Text style={styles.value}>{rightValue}</Text>
        )}
      </View>
    </View>
  );
}
