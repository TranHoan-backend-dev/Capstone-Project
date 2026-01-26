import React from 'react';
import { View, Text } from 'react-native';
import styles from './invoiceDetail.styles';

export default function InvoiceListHeader() {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>📋 Danh sách hoá đơn</Text>
    </View>
  );
}
