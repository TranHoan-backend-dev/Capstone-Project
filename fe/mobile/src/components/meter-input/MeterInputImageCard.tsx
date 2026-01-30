import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterInput.styles';

interface MeterInputImageCardProps {
  image: string | null;
  onImagePress: () => void;
}

export default function MeterInputImageCard({
  image,
  onImagePress,
}: MeterInputImageCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <TouchableOpacity style={styles.imageButton} onPress={onImagePress}>
          <Icon name="camera" size={40} color="#1E88E5" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
}
