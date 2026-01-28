import React from 'react';
import { Searchbar } from 'react-native-paper';
import { style } from './invoiceStyles';

export default function InvoiceSearch({ value, onChange }: any) {
  return (
    <Searchbar
      placeholder="Nhập mã, tên, điện thoại, địa chỉ"
      value={value}
      onChangeText={onChange}
      style={style.searchbar}
    />
  );
}
