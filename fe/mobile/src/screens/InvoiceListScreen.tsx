import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { style } from '../components/invoice-list/invoiceStyles';
import InvoiceFilter from '../components/invoice-list/InvoiceFilter.tsx';
import InvoiceSearch from '../components/invoice-list/InvoiceSearch';
import InvoiceCard from '../components/invoice-list/InvoiceCard';

const DATA = [
  {
    id: '015281',
    name: 'Nguyễn Văn Tiến',
    address: '621 Trường Chinh, Phường Nam Định, Tỉnh Ninh Bình',
    phone: '0854423286',
    totalInvoices: 0,
    totalMoney: 0,
    paymentMethod: 'Chuyển khoản',
  },
  {
    id: '015282',
    name: 'Trần Thị Côi',
    address: '619 Trường Chinh, Phường Nam Định, Tỉnh Ninh Bình',
    phone: '0917180652',
    totalInvoices: 0,
    totalMoney: 0,
    paymentMethod: 'Chuyển khoản',
  },
  {
    id: '015283',
    name: 'Dương Tuấn Phương',
    address: '617 Trường Chinh, Phường Nam Định, Tỉnh Ninh Bình',
    phone: '0912110222',
    totalInvoices: 0,
    totalMoney: 0,
    paymentMethod: 'Chuyển khoản',
  },
];

export default function InvoiceListScreen({ navigation }: any) {
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');

  return (
    <View style={style.container}>
      <Appbar.Header style={{ backgroundColor: '#fff', elevation: 1 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#333" />
        <Appbar.Content title="Danh sách hoá đơn" titleStyle={{ color: '#333', fontSize: 18, fontWeight: 'normal' }} />
      </Appbar.Header>

      <View style={style.content}>
        <InvoiceFilter value={filter} onChange={setFilter} />

        <Text style={[style.sectionLabel, { marginTop: 8, marginBottom: 8 }]}>Danh sách hoá đơn</Text>
        <InvoiceSearch value={search} onChange={setSearch} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          {DATA.map(item => (
            <InvoiceCard key={item.id} invoice={item} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
