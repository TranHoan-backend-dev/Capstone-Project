import React from 'react';
import { View } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import common from './common.styles';

interface InfoRowDisplayProps {
  label: string;
  value: string;
  showDivider?: boolean;
}

export default function InfoRowDisplay({
  label,
  value,
  showDivider = true,
}: InfoRowDisplayProps) {
  return (
    <>
      <View style={common.infoRow}>
        <Text style={common.infoLabel}>{label}</Text>
        <Text style={common.infoValue}>{value}</Text>
      </View>
      {showDivider && <Divider style={common.divider} />}
    </>
  );
}
