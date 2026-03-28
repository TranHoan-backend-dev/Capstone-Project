import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Appbar, Portal, Modal, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import InvoiceDetailCard from '../components/invoice-detail/InvoiceDetailCard';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceDetail'>;

const MOCK_INVOICES = [
  {
    customerId: '015281',
    status: 'collected',
    khoaKy: '12/2025',
    soHD: 584,
    soHDMoi: 588,
    m3: 4,
    tienThu: 39560,
    tienNo: 0,
    ngayThu: '12/01/2026 08:16',
    nvThu: 'payoo',
    daXemHoaDon: true,
    daXemHinh: true,
  },
];

import { meterService } from '../services/meterService';
import { useEffect } from 'react';

export default function InvoiceDetailScreen({ navigation, route }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [_invoiceData, _setInvoiceData] = useState<any>(null);

  useEffect(() => {
    /* Comment out real fetch for development bypass
    const fetchInvoice = async () => {
      try {
        const customerId = route.params?.customerId || '015281';
        const recentData = await meterService.getRecentUsage(customerId);
        if (recentData && recentData.usagesList && recentData.usagesList.length > 0) {
          const latest = recentData.usagesList[0];
          _setInvoiceData({
            customerId: recentData.customerId,
            status: latest.isPaid ? 'collected' : 'pending',
            khoaKy: latest.recordingDate.substring(0, 7), // YYYY-MM
            soHD: latest.index, 
            soHDMoi: latest.index, 
            m3: latest.mass,
            tienThu: latest.price,
            tienNo: 0,
            ngayThu: latest.recordingDate,
            nvThu: latest.paymentMethod || 'N/A',
            imageUrl: latest.meterImageUrl
          });
        }
      } catch (error) {
        console.error('Fetch invoice failed:', error);
      }
    };
    fetchInvoice();
    */
  }, [route.params?.customerId]);

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Appbar.Header style={{ backgroundColor: '#fff', elevation: 1 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#333" />
        <Appbar.Content title="Thu tiền" titleStyle={{ color: '#333', fontSize: 18 }} />
      </Appbar.Header>

      <ScrollView style={{ flex: 1, padding: 12 }} showsVerticalScrollIndicator={false}>
        {/* Customer Info Card */}
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd', marginBottom: 16 }}>
          <View style={{ backgroundColor: '#1E88E5', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="account-circle" size={24} color="#fff" />
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>
                {route.params?.customerName || 'Nguyễn Văn Tiến'}
              </Text>
            </View>
            <Icon name="dots-horizontal-circle-outline" size={24} color="#fff" />
          </View>

          <View style={{ padding: 12, backgroundColor: '#fff' }}>
            <View style={{ flexDirection: 'row', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Icon name="card-account-details-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 14, color: '#333' }}>Mã KH</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#D32F2F', marginLeft: 16 }}>015281</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#333' }}>STT</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1E88E5', marginLeft: 16 }}>1</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
              <Icon name="map-marker-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 14, color: '#333', marginRight: 8 }}>Địa chỉ</Text>
              <Text style={{ fontSize: 13, color: '#333', flex: 1 }}>
                621 Trường Chinh, Phường Nam Định, Tỉnh Ninh Bình
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="phone-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 14, color: '#333', marginRight: 8 }}>Điện thoại</Text>
              <Text style={{ fontSize: 14, color: '#333', flex: 1, textAlign: 'right' }}>0854423286</Text>
            </View>
          </View>
        </View>

        {/* Invoice List Header */}
        <View style={{ backgroundColor: '#1E88E5', borderRadius: 4, flexDirection: 'row', alignItems: 'center', padding: 8, marginBottom: 4 }}>
          <Icon name="format-list-bulleted" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontWeight: '500' }}>Danh sách hoá đơn</Text>
        </View>

        {/* Invoice Detail Card (Yellow) */}
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
          onShowReceipt={() => setShowReceipt(true)}
          onShowImage={() => setShowImage(true)}
        />
      </ScrollView>

      {/* Footer Navigation */}
      <View style={{ flexDirection: 'row', height: 60 }}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#1E88E5', justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#fff' }}
          onPress={handlePrev}
        >
          <Text style={{ color: '#fff', fontSize: 24 }}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 2, backgroundColor: '#1E88E5', justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}>Thanh toán</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#1E88E5', justifyContent: 'center', alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#fff' }}
          onPress={handleNext}
        >
          <Text style={{ color: '#fff', fontSize: 24 }}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal View for Receipt (Image 2) */}
      <Portal>
        <Modal
          visible={showReceipt}
          onDismiss={() => setShowReceipt(false)}
          contentContainerStyle={{ backgroundColor: '#fff', margin: 20, borderRadius: 8, padding: 0, overflow: 'hidden' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Icon name="file-document-outline" size={24} color="#666" style={{ marginRight: 8 }} />
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '500' }}>Giấy báo tiền nước</Text>
            <IconButton icon="close-circle" iconColor="#D32F2F" onPress={() => setShowReceipt(false)} />
          </View>
          <ScrollView style={{ padding: 12, maxHeight: 500 }}>
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>CÔNG TY CP CẤP NƯỚC NAM ĐỊNH</Text>
              <Text style={{ fontSize: 12, textAlign: 'center' }}>30 Cù Chính Lan, Phường Nam Định</Text>
              <Text style={{ fontSize: 12, textAlign: 'center' }}>MST: 6000000000</Text>
              <Text style={{ fontWeight: 'bold', marginTop: 12, fontSize: 16 }}>GIẤY BÁO TIỀN NƯỚC</Text>
              <Text style={{ fontSize: 14 }}>Kỳ HĐ: 12/2025</Text>
            </View>
            <View style={{ gap: 4, marginBottom: 16 }}>
              <Text>Từ ngày: 25/11/2025</Text>
              <Text>đến ngày: 24/12/2025</Text>
              <Text>Tên KH: Trần đăng Long</Text>
              <Text>Địa chỉ: 24/605 Trường Chinh, Phường Nam Định</Text>
              <Text>Mã KH: 015329</Text>
            </View>
            <View style={{ borderWidth: 1, borderColor: '#333' }}>
              {/* Header row */}
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#333', backgroundColor: '#f9f9f9' }}>
                <Text style={{ flex: 1, padding: 4, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#333' }}>MĐ</Text>
                <Text style={{ flex: 1, padding: 4, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#333' }}>M3</Text>
                <Text style={{ flex: 1, padding: 4, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#333' }}>Giá</Text>
                <Text style={{ flex: 1.5, padding: 4, textAlign: 'center' }}>Thành tiền</Text>
              </View>
              {/* Data row */}
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#333' }}>
                <Text style={{ flex: 1, padding: 4, borderRightWidth: 1, borderRightColor: '#333' }}>Nước SH1</Text>
                <Text style={{ flex: 1, padding: 4, textAlign: 'center', borderRightWidth: 1, borderRightColor: '#333' }}>5</Text>
                <Text style={{ flex: 1, padding: 4, textAlign: 'right', borderRightWidth: 1, borderRightColor: '#333' }}>8.600</Text>
                <Text style={{ flex: 1.5, padding: 4, textAlign: 'right' }}>43.000</Text>
              </View>
              <View style={{ padding: 4 }}>
                <Text style={{ textAlign: 'right' }}>Cộng: 43.000</Text>
                <Text style={{ textAlign: 'right' }}>Thuế suất 5%: 2.150</Text>
                <Text style={{ textAlign: 'right' }}>Thành tiền: 45.150</Text>
                <Text style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>Tổng cộng: 49.450</Text>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Modal View for Image (Image 3) */}
      <Portal>
        <Modal
          visible={showImage}
          onDismiss={() => setShowImage(false)}
          contentContainerStyle={{ backgroundColor: '#fff', margin: 40, borderRadius: 8, padding: 0 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Icon name="image-outline" size={24} color="#666" style={{ marginRight: 8 }} />
            <Text style={{ flex: 1, fontSize: 16, fontWeight: '500' }}>Hình ảnh đính kèm</Text>
            <IconButton icon="close-circle" iconColor="#D32F2F" onPress={() => setShowImage(false)} />
          </View>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <View style={{ width: 150, height: 150, backgroundColor: '#333', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Icon name="water-pump" size={80} color="#666" />
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
