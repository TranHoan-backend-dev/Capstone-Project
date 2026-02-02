import React from 'react';
import { Card, TextInput } from 'react-native-paper';
import styles from './meterInput.styles';

interface MeterInputNotesCardProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

export default function MeterInputNotesCard({
  notes,
  onNotesChange,
}: MeterInputNotesCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <TextInput
          mode="outlined"
          placeholder="Nhập ghi chú..."
          value={notes}
          onChangeText={onNotesChange}
          multiline
          numberOfLines={3}
          style={styles.notesInput}
        />
      </Card.Content>
    </Card>
  );
}
