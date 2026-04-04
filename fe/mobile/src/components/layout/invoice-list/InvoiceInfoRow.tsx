import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { style } from './invoiceStyles';

export default function InvoiceInfoRow({ icon, text }: any) {
  return (
    <View style={style.infoRow}>
      <Text style={style.infoText}>{text}</Text>
    </View>
  );
}
