import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { Appbar } from 'react-native-paper';
import { style } from '../components/invoice-list/invoiceStyles';
import InvoiceFilter from '../components/invoice-list/InvoiceFilter.tsx';
import InvoiceSearch from '../components/invoice-list/InvoiceSearch';
import InvoiceCard from '../components/invoice-list/InvoiceCard';
import { customerService } from '../services/customerService';
import { useRoute } from '@react-navigation/native';

const MOCK_DATA = [
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
  const route = useRoute<any>();
  const { roadmapId } = route.params || {};
  
  const [filter, setFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState<any[]>(MOCK_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await customerService.getCustomersByRoadmap(roadmapId, search);
        if (data && data.content) {
          const mappedData = data.content.map((c: any) => ({
            id: c.customerId,
            name: c.name,
            address: c.address,
            phone: c.phoneNumber,
            totalInvoices: 0,
            totalMoney: '0',
            paymentMethod: c.paymentMethod || 'Tiền mặt',
          }));
          // Kết hợp dữ liệu thật với mock data hoặc hiển thị dữ liệu thật nếu có
          setCustomers(mappedData.length > 0 ? mappedData : MOCK_DATA);
        } else {
          setCustomers(MOCK_DATA);
        }
      } catch (error) {
        console.error('Error fetching customers by roadmap:', error);
        setCustomers(MOCK_DATA);
      } finally {
        setLoading(false);
      }
    };

    if (roadmapId) {
      fetchCustomers();
    } else {
      setCustomers(MOCK_DATA);
    }
  }, [roadmapId, search]);

  return (
    <View style={style.container}>
      <Appbar.Header style={{ backgroundColor: '#fff', elevation: 1 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#333" />
        <Appbar.Content title="Danh sách hoá đơn" titleStyle={{ color: '#333', fontSize: 18, fontWeight: 'normal' }} />
      </Appbar.Header>

      <View style={style.content}>
        <InvoiceFilter value={filter} onChange={setFilter} />

        <Text style={[style.sectionLabel, { marginTop: 8, marginBottom: 8 }]}>Danh sách khách hàng ({customers.length})</Text>
        <InvoiceSearch value={search} onChange={setSearch} />

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1E88E5" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {customers.length > 0 ? (
              customers.map(item => (
                <InvoiceCard key={item.id} invoice={item} />
              ))
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text style={{ color: '#666' }}>Không tìm thấy khách hàng nào</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
