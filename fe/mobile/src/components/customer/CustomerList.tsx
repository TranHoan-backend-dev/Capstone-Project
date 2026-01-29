import React from 'react';
import { ScrollView } from 'react-native';
import CustomerCard from './CustomerCard';

interface CustomerListProps {
  searchQuery: string;
  statusFilter: string;
}

const customers = [
  {
    id: '015281',
    stt: 1,
    name: 'Nguyễn Văn Tiến',
    address: '621, Trường Chinh, Nam Định',
    date: '24/12/2025 11:44',
    newIndex: 588,
    m3: 4,
    status: 'Đã ghi',
    amount: '39.560',
  },
  {
    id: '015282',
    stt: 2,
    name: 'Trần Thị Cói',
    address: '619, Trường Chinh, Nam Định',
    date: '24/12/2025 11:45',
    newIndex: 1229,
    m3: 57,
    status: 'Đã ghi',
    amount: '782.575',
  },
];

export default function CustomerList({
  searchQuery,
  statusFilter,
}: CustomerListProps) {

  const filteredCustomers = customers.filter(c => {
    const matchSearch =
      c.id.includes(searchQuery) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus =
      statusFilter === 'Tất cả' || c.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <ScrollView>
      {filteredCustomers.map(customer => (
        <CustomerCard key={customer.id} data={customer} />
      ))}
    </ScrollView>
  );
}
