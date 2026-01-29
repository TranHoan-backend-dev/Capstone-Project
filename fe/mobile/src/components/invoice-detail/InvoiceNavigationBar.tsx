import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './invoiceDetail.styles';

interface Props {
  disablePrev: boolean;
  disableNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPay: () => void;
}

export default function InvoiceNavigationBar({
  disablePrev,
  disableNext,
  onPrev,
  onNext,
  onPay,
}: Props) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity
        onPress={onPrev}
        disabled={disablePrev}
        style={[styles.navBtn, { opacity: disablePrev ? 0.5 : 1 }]}
      >
        <Text style={styles.navText}>&lt;</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPay} style={styles.payBtn}>
        <Text style={styles.payText}>Thanh toán</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        disabled={disableNext}
        style={[styles.navBtn, { opacity: disableNext ? 0.5 : 1 }]}
      >
        <Text style={styles.navText}>&gt;</Text>
      </TouchableOpacity>
    </View>
  );
}
