import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Đang tải danh sách khách hàng...</Text>
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
    status: c.status,
    amount: c.latestUsage ? c.latestUsage.price : '---.---',
    meterId: c.waterMeterId,
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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không tìm thấy khách hàng nào</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.listContent}>
      {filteredCustomers.map(customer => (
        <CustomerCard key={customer.id} data={customer} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#999',
  },
  listContent: {
    paddingBottom: 20,
  },
});
