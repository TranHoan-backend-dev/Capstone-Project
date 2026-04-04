import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './invoiceDetail.styles';

interface Props {
  index: number;
  max: number;
  onPrev: () => void;
  onNext: () => void;
  onPay: () => void;
}

export default function BottomActionBar({
  index,
  max,
  onPrev,
  onNext,
  onPay,
}: Props) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity disabled={index === 0} onPress={onPrev} style={styles.navBtn}>
        <Text style={styles.navText}>{'<'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPay} style={styles.payBtn}>
        <Text style={styles.payText}>Thanh toán</Text>
      </TouchableOpacity>

      <TouchableOpacity disabled={index === max - 1} onPress={onNext} style={styles.navBtn}>
        <Text style={styles.navText}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
}
