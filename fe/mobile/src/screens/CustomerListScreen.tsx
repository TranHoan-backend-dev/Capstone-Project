import React, { useState } from 'react';
import { View, StatusBar } from 'react-native';
import CustomerHeader from '../components/customer/CustomerHeader';
import CustomerFilter from '../components/customer/CustomerFilter';
import CustomerSearch from '../components/customer/CustomerSearch';
import CustomerList from '../components/customer/CustomerList';
import styles from '../components/customer/customer.styles';

const CustomerListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E88E5" />

      <CustomerHeader />

      <View style={styles.content}>
        <CustomerFilter
          value={statusFilter}
          onChange={setStatusFilter}
        />

        <CustomerSearch
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <CustomerList
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </View>
    </View>
  );
};

export default CustomerListScreen;
