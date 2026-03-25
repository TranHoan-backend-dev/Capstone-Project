import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import CustomerCard from './CustomerCard';

interface CustomerListProps {
  customers: any[];
  loading: boolean;
  searchQuery: string;
  statusFilter: string;
}

export default function CustomerList({
  customers,
  loading,
  searchQuery,
  statusFilter,
}: CustomerListProps) {

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={{ marginTop: 10, color: '#666' }}>Đang tải danh sách khách hàng...</Text>
      </View>
    );
  }

  const mappedCustomers = customers.map((c, index) => ({
    id: c.customerId,
    stt: index + 1,
    name: c.name,
    address: c.address,
    date: c.latestUsage ? new Date(c.latestUsage.recordingDate).toLocaleDateString('vi-VN') : '--/--/----',
    newIndex: c.latestUsage ? c.latestUsage.index : '----',
    m3: c.latestUsage ? c.latestUsage.mass : '--',
    status: c.displayStatus,
    amount: c.latestUsage ? c.latestUsage.price : '---.---',
  }));

  const filteredCustomers = mappedCustomers.filter(c => {
    const matchSearch =
      c.id.includes(searchQuery) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === 'Tất cả' || c.status === statusFilter;

    return matchSearch && matchStatus;
  });

  if (filteredCustomers.length === 0) {
    return (
      <View style={{ alignItems: 'center', padding: 40 }}>
        <Text style={{ color: '#999' }}>Không tìm thấy khách hàng nào</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      {filteredCustomers.map(customer => (
        <CustomerCard key={customer.id} data={customer} />
      ))}
    </ScrollView>
  );
}
