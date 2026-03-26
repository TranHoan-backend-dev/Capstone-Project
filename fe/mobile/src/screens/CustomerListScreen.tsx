import React, { useState, useEffect, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { customerService } from '../services/customerService';
import { meterService } from '../services/meterService';
import CustomerHeader from '../components/customer/CustomerHeader';
import CustomerFilter from '../components/customer/CustomerFilter';
import CustomerSearch from '../components/customer/CustomerSearch';
import CustomerList from '../components/customer/CustomerList';
import styles from '../components/customer/customer.styles';

const CustomerListScreen = () => {
  const route = useRoute<any>();
  const { routeId } = route.params || {};
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  const fetchCustomers = useCallback(async () => {
    // if (!routeId) return;
    try {
      setLoading(true);

      // // 1. Lấy danh sách khách hàng từ roadmap (customer service)
      // console.log('[CustomerListScreen.tsx] getCustomersByRoadmap')
      // const resCustomers = await customerService.getCustomersByRoadmap(routeId);
      // console.log('[CustomerListScreen.tsx] data: ' + resCustomers)
      // const customerData = resCustomers.content || [];

      // if (customerData.length === 0) {
      //   setCustomers([]);
      //   return;
      // }

      // // 2. Lấy dữ liệu ghi nước cho các khách hàng này (device service)
      // const customerIds = customerData.map((c: any) => c.customerId).join(',');
      // const resUsages = await meterService.getUsageHistory(customerIds);

      // // 3. Join dữ liệu
      // const joinedData = customerData.map((c: any) => {
      //   const usageRes = resUsages.find((u: any) => u.customerId === c.customerId);
      //   // Lấy bản ghi cuối cùng của tháng này (nếu có)
      //   const currentMonth = new Date().getMonth() + 1;
      //   const currentYear = new Date().getFullYear();

      //   const latestUsage = usageRes?.usagesList?.sort((a: any, b: any) =>
      //     new Date(b.recordingDate).getTime() - new Date(a.recordingDate).getTime()
      //   )[0];

      //   // Xác định trạng thái dựa trên status của bản ghi mới nhất
      //   let status = 'Chưa ghi';
      //   if (latestUsage) {
      //     const usageDate = new Date(latestUsage.recordingDate);
      //     if (usageDate.getMonth() + 1 === currentMonth && usageDate.getFullYear() === currentYear) {
      //       status = latestUsage.status === 'PENDING' ? 'Đã ghi (Chờ duyệt)' : 'Đã ghi';
      //     }
      //   }

      //   return {
      //     ...c,
      //     latestUsage,
      //     displayStatus: status,
      //   };
      // });

      // setCustomers(joinedData);
      // Mock data
      const mockCustomers = [
        {
          customerId: 'KH001',
          name: 'Nguyễn Văn An',
          address: '123 Đường ABC, Phường 1, Quận 1, TP.HCM',
          displayStatus: 'Đã ghi',
          latestUsage: {
            recordingDate: new Date().toISOString(),
            index: 150,
            mass: 12,
            price: '150.000',
          }
        },
        {
          customerId: 'KH002',
          name: 'Trần Thị Bình',
          address: '456 Đường DEF, Phường 2, Quận 3, TP.HCM',
          displayStatus: 'Chưa ghi',
          latestUsage: null
        },
        {
          customerId: 'KH003',
          name: 'Lê Văn Cường',
          address: '789 Đường GHI, Phường 5, Quận Gò Vấp, TP.HCM',
          displayStatus: 'Đã ghi (Chờ duyệt)',
          latestUsage: {
            recordingDate: new Date().toISOString(),
            index: 210,
            mass: 18,
            price: '210.000',
          }
        },
        {
          customerId: 'KH004',
          name: 'Phạm Minh Đức',
          address: '101 Đường JKL, Quận Bình Thạnh, TP.HCM',
          displayStatus: 'Chưa ghi',
          latestUsage: null
        },
        {
          customerId: 'KH005',
          name: 'Hoàng Anh Tuấn',
          address: '202 Đường MNO, Quận Tân Bình, TP.HCM',
          displayStatus: 'Đã ghi',
          latestUsage: {
            recordingDate: new Date().toISOString(),
            index: 345,
            mass: 25,
            price: '345.000',
          }
        }
      ];

      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Failed to fetch customers or usages:', error);
    } finally {
      setLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

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
          customers={customers}
          loading={loading}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      </View>
    </View>
  );
};

export default CustomerListScreen;
