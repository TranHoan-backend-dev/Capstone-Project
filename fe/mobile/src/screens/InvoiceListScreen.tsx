import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { style } from '../components/invoice-list/invoiceStyles';
import InvoiceFilter from '../components/invoice-list/InvoiceFilter.tsx';
import InvoiceSearch from '../components/invoice-list/InvoiceSearch';
import InvoiceCard from '../components/invoice-list/InvoiceCard';

const DATA = [
  {
    id: '015284',
    name: 'Nguyễn Đức Nhiên',
    address: '617 Trường Chinh, Phường Nam Định, Tỉnh Ninh Bình',
    phone: '0911150800',
    totalInvoices: 0,
    totalMoney: 0,
    paymentMethod: 'Không phát sinh nợ',
    paymentColor: '#15803d',
  },
  {
    id: '015285',
    name: 'Hoàng Văn Mai',
    address: '615 Trường Chinh, Phường Nam Định, Tỉnh Ninh Bình',
    phone: '0911150800',
    totalInvoices: 0,
    totalMoney: 0,
    paymentMethod: 'Chuyển khoản',
    paymentColor: '#f59e0b',
  },
];

export default function InvoiceListScreen() {
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');

  return (
    <View style={style.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="Danh sách hóa đơn" />
      </Appbar.Header>

      <View style={style.content}>
        <InvoiceFilter value={filter} onChange={setFilter} />
        <InvoiceSearch value={search} onChange={setSearch} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {DATA.map(item => (
            <InvoiceCard key={item.id} invoice={item} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
