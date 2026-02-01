import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './invoiceDetail.styles';

interface Props {
  customerName: string;
  customerId: string;
  address: string;
  phone?: string;
}

export default function CustomerInfoCard({
  customerName,
  customerId,
  address,
  phone,
}: Props) {
  return (
    <View style={styles.customerCard}>
      <View style={styles.customerHeader}>
        <View style={styles.customerNameRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.customerName}>{customerName}</Text>
        </View>

        <TouchableOpacity style={styles.infoButton}>
          <Text style={styles.infoIcon}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.customerRow}>
        <View style={styles.customerCol}>
          <Text style={styles.label}>Mã KH</Text>
          <Text style={styles.value}>{customerId}</Text>
        </View>
        <View style={styles.customerCol}>
          <Text style={styles.label}>STT</Text>
          <Text style={styles.value}>1</Text>
        </View>
      </View>

      <Text style={styles.label}>Địa chỉ</Text>
      <Text style={styles.value}>{address}</Text>

      {phone && (
        <>
          <Text style={styles.label}>Điện thoại</Text>
          <Text style={styles.value}>{phone}</Text>
        </>
      )}
    </View>
  );
}
