import React from 'react';
import { Searchbar } from 'react-native-paper';
import styles from './customer.styles';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function CustomerSearch({ value, onChange }: Props) {
  return (
    <Searchbar
      placeholder="Nhập mã, tên, điện thoại, địa chỉ, mã đồng hồ"
      value={value}
      onChangeText={onChange}
      style={styles.searchbar}
    />
  );
}
