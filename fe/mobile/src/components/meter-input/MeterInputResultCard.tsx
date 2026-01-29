import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import styles from './meterInput.styles';

interface MeterInputResultCardProps {
  m3: string;
  amount: string;
}

export default function MeterInputResultCard({ m3, amount }: MeterInputResultCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.resultRow}>
          <View style={styles.resultColumn}>
            <Text style={styles.resultLabel}>M3</Text>
            <Text style={styles.resultValue}>{m3}</Text>
          </View>
          <View style={styles.resultColumn}>
            <Text style={styles.resultLabel}>Số tiền</Text>
            <Text style={[styles.resultValue, styles.amountValue]}>{amount}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
