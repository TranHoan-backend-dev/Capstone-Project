import React from 'react';
import { View, Text } from 'react-native';
import styles from './meterRoute.styles';

export default function MeterRouteFooter() {
  const totalCustomer = 2556;
  const totalRecorded = 2554;
  const totalUnrecorded = 2;
  const totalCutWater = 0;
  const totalM3 = '26.222';
  const totalAmount = '278.484.910';

  return (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.footerStatGroup}>
          <Text style={styles.footerLabel}>Số KH:</Text>
          <Text style={styles.footerValue}>{totalCustomer}</Text>
        </View>
        <View style={styles.footerStatGroup}>
          <Text style={styles.footerLabel}>Cắt nước:</Text>
          <Text style={styles.footerValue}>{totalCutWater}</Text>
        </View>
      </View>

      <View style={styles.footerContent}>
        <View style={styles.footerStatGroup}>
          <Text style={styles.footerLabel}>Đã ghi:</Text>
          <Text style={styles.footerValue}>{totalRecorded}</Text>
        </View>
        <View style={styles.footerStatGroup}>
          <Text style={styles.footerLabel}>Chưa ghi:</Text>
          <Text style={styles.footerValue}>{totalUnrecorded}</Text>
        </View>
      </View>

      <View style={styles.footerDivider} />

      <View style={styles.footerContent}>
        <View style={styles.footerStatGroup}>
          <Text style={styles.footerLabel}>M3:</Text>
          <Text style={styles.footerValue}>{totalM3}</Text>
        </View>
        <View style={styles.footerStatGroup}>
          <Text style={styles.footerLabel}>Tổng tiền:</Text>
          <Text style={[styles.footerValue, styles.footerAmount]}>{totalAmount}</Text>
        </View>
      </View>
    </View>
  );
}
