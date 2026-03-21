import React from 'react';
import { Searchbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';

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
      inputStyle={styles.input}
      iconColor="#000"
      placeholderTextColor="#999"
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    marginVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    elevation: 0,
  },
  input: {
    fontSize: 14,
  },
});

