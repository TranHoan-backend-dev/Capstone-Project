import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import InvoiceDetailCard from '../components/invoice-detail/InvoiceDetailCard';
import styles from '../components/debt-route/debtRoute.styles';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceDetail'>;

const MOCK_INVOICES = [
  {
    customerId: '015281',
    status: 'pending',
    khoaKy: '12/2025',
    soHD: 584,
    soHDMoi: 588,
    m3: 4,
    tienThu: 39560,
    tienNo: 0,
    ngayThu: '12/01/2026 08:16',
    nvThu: 'payso',
    daXemHoaDon: true,
    daXemHinh: false,
  },
  {
    customerId: '015281',
    status: 'collected',
    khoaKy: '11/2025',
    soHD: 41,
    soHDMoi: 46,
    m3: 5,
    tienThu: 49450,
    tienNo: 0,
    ngayThu: '16/01/2026 20:38',
    nvThu: 'GT106',
    daXemHoaDon: true,
    daXemHinh: false,
  },
];

export default function InvoiceDetailScreen({ navigation, route }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const invoice = MOCK_INVOICES[currentIndex];

  const handleNext = () => {
    if (currentIndex < MOCK_INVOICES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Thu tiền" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="bell-outline" color="#fff" />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Customer Info Card - Blue */}
        <View style={{ backgroundColor: '#1E88E5', borderRadius: 8, padding: 12, marginBottom: 12, overflow: 'hidden' }}>
          {/* Customer Name Row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#90CAF9', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#1E88E5', fontWeight: 'bold' }}>👤</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                {route.params?.customerName || 'Nguyễn Văn Tiến'}
              </Text>
            </View>
            <TouchableOpacity style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, color: '#fff' }}>ⓘ</Text>
            </TouchableOpacity>
          </View>

          {/* ID and STT */}
          <View style={{ flexDirection: 'row', marginBottom: 8, gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>Mã KH</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>{route.params?.customerId || '015281'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>STT</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff' }}>1</Text>
            </View>
          </View>

          {/* Address */}
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>Địa chỉ</Text>
            <Text style={{ fontSize: 12, color: '#fff' }}>
              {route.params?.address || '621 Trường Chinh, Phường Nam Định, Tỉnh Ninh Bình'}
            </Text>
          </View>

          {/* Phone */}
          <View>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>Điện thoại</Text>
            <Text style={{ fontSize: 12, color: '#fff' }}>{route.params?.phone || '0854423286'}</Text>
          </View>
        </View>

        {/* Invoice List Section Header */}
        <View style={{ backgroundColor: '#1E88E5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#fff', marginLeft: 8 }}>📋 Danh sách hoá đơn</Text>
        </View>

        {/* Invoice Detail Card */}
        <InvoiceDetailCard
          status={invoice.status as any}
          khoaKy={invoice.khoaKy}
          soHD={invoice.soHD}
          soHDMoi={invoice.soHDMoi}
          m3={invoice.m3}
          tienThu={invoice.tienThu}
          tienNo={invoice.tienNo}
          ngayThu={invoice.ngayThu}
          nvThu={invoice.nvThu}
          daXemHoaDon={invoice.daXemHoaDon}
          daXemHinh={invoice.daXemHinh}
        />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#1E88E5',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentIndex === 0}
          style={{
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 14,
            opacity: currentIndex === 0 ? 0.5 : 1,
          }}
        >
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>&lt;</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // Handle payment
            console.log('Thanh toán invoice', currentIndex);
          }}
          style={{
            flex: 0.6,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 14,
            backgroundColor: '#1565C0',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Thanh toán</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === MOCK_INVOICES.length - 1}
          style={{
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 14,
            opacity: currentIndex === MOCK_INVOICES.length - 1 ? 0.5 : 1,
          }}
        >
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold' }}>&gt;</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
