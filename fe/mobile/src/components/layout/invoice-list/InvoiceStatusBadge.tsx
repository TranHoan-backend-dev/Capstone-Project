import React from 'react';
import { View, Text } from 'react-native';
import { style} from './invoiceStyles';

export default function InvoiceStatusBadge({ text, color }: any) {
  return (
    <View style={[style.statusBadge, { backgroundColor: color }]}>
      <Text style={style.statusText}>Hình thức thanh toán: {text}</Text>
    </View>
  );
}
