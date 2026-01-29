import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import common from './common.styles';

interface StatRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

export default function StatRow({
  label,
  value,
  valueColor = '#1E88E5',
}: StatRowProps) {
  return (
    <View style={common.statItem}>
      <Text style={common.statLabel}>{label}</Text>
      <Text style={[common.statValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}
