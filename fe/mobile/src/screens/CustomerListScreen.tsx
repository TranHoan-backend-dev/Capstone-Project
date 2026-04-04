import React, { useState, useCallback } from 'react';
import { View, StatusBar } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
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
    if (!routeId) return;

    const cacheKey = `customers:${routeId}`;
    const { cacheService } = require('../services/cacheService');

    // 1. Kiểm tra cache trước để hiển thị dữ liệu ngay lập tức
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      setCustomers(cachedData);
    } else {
      setLoading(true);
    }

    try {
      // 2. Lấy danh sách khách hàng từ roadmap (customer service)
      console.log('[CustomerListScreen.tsx] getCustomersByRoadmap')
      const resCustomers = await customerService.getCustomersByRoadmap(routeId);
      console.log('[CustomerListScreen.tsx] data: ' + resCustomers)
      const customerData = resCustomers.content || [];

      if (customerData.length === 0) {
        setCustomers([]);
        cacheService.set(cacheKey, []);
        return;
      }

      // 2. Lấy dữ liệu ghi nước và cả trạng thái chụp ảnh cục bộ (tránh lag backend)
      const customerIds = customerData.map((c: any) => c.customerId).join(',');
      
      const { localCapturedService } = require('../services/localCapturedService');
      const [resUsages, localCapturedIds] = await Promise.all([
        meterService.getUsageHistory(customerIds),
        localCapturedService.getCapturedIds()
      ]);

      // 3. Join dữ liệu
      const joinedData = customerData.map((c: any) => {
        const usageRes = resUsages.find((u: any) => u.customerId === c.customerId);
        // Lấy bản ghi cuối cùng của tháng này (nếu có)
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const latestUsage = usageRes?.usagesList?.sort((a: any, b: any) =>
          new Date(b.recordingDate).getTime() - new Date(a.recordingDate).getTime()
        )[0];

        // Xác định trạng thái dựa trên status của bản ghi mới nhất HOẶC trạng thái chụp ảnh cục bộ
        let status = 'Chưa ghi';
        
        // Ưu tiên trạng thái cục bộ nếu mới chụp xong mà backend chưa có record
        if (localCapturedIds.includes(c.customerId)) {
          status = 'Đã chụp ảnh';
        }

        if (latestUsage) {
          const usageDate = new Date(latestUsage.recordingDate);
          if (usageDate.getMonth() + 1 === currentMonth && usageDate.getFullYear() === currentYear) {
            // Khi mới chụp ảnh và gửi thành công (status=PENDING), hiển thị "Đã chụp ảnh" (màu vàng)
            // Khi đã được duyệt (status=APPROVED hoặc trạng thái hoàn tất), hiển thị "Đã ghi" (màu xanh)
            if (latestUsage.status === 'PENDING') {
              status = 'Đã chụp ảnh';
            } else if (latestUsage.status === 'APPROVED' || latestUsage.status === 'COMPLETED') {
              status = 'Đã ghi';
            }
          }
        }

        return {
          ...c,
          latestUsage,
          status: status, // Dùng 'status' thay vì 'displayStatus' để đồng nhất với CustomerCard
        };
      });

      setCustomers(joinedData);
      cacheService.set(cacheKey, joinedData);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [routeId]);

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers])
  );

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
