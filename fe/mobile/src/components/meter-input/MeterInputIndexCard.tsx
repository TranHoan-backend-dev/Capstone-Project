import React from 'react';
import { View } from 'react-native';
import { Card, TextInput, Button, Text } from 'react-native-paper';
import styles from './meterInput.styles';
import MeterInputResultCard from './MeterInputResultCard';

interface MeterInputIndexCardProps {
  oldIndex: string;
  newIndex: string;
  onNewIndexChange: (value: string) => void;
  onCalculate: () => void;
}

export default function MeterInputIndexCard({
  oldIndex,
  newIndex,
  onNewIndexChange,
  onCalculate,
}: MeterInputIndexCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.indexRow}>
          <View style={styles.indexColumn}>
            <Text style={styles.indexLabel}>Chỉ số cũ</Text>
            <TextInput
              mode="outlined"
              value={oldIndex}
              style={styles.indexInput}
              editable={false}
            />
          </View>
          <View style={styles.indexColumn}>
            <Text style={styles.indexLabel}>Chỉ số mới</Text>
            <TextInput
              mode="outlined"
              value={newIndex}
              onChangeText={onNewIndexChange}
              style={styles.indexInput}
              keyboardType="numeric"
            />
          </View>
        </View>
        <MeterInputResultCard m3="" amount="" />
      </Card.Content>
    </Card>
  );
}
