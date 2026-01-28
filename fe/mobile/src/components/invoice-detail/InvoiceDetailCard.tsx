import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../debt-route/debtRoute.styles';

interface InvoiceDetailCardProps {
  status?: 'pending' | 'collected';
  khoaKy: string;
  soHD: number;
  soHDMoi: number;
  m3: number;
  tienThu: number;
  tienNo: number;
  ngayThu: string;
  nvThu: string;
  daXemHoaDon?: boolean;
  daXemHinh?: boolean;
  daXemON?: boolean;
}

const getStatusColor = (status: string) => {
  return status === 'collected' ? '#4CAF50' : '#FFEB3B';
};

const getStatusTextColor = (status: string) => {
  return status === 'collected' ? '#fff' : '#000';
};

export default function InvoiceDetailCard({
  status = 'pending',
  khoaKy,
  soHD,
  soHDMoi,
  m3,
  tienThu,
  tienNo,
  ngayThu,
  nvThu,
  daXemHoaDon = true,
  daXemHinh = false,
  daXemON = false,
}: InvoiceDetailCardProps) {
  const statusBgColor = getStatusColor(status);
  const statusTextColor = getStatusTextColor(status);

  return (
    <View style={{ backgroundColor: statusBgColor, borderRadius: 8, padding: 12, marginBottom: 12 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: status === 'collected' ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)',
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: statusTextColor }}>Kỳ: {khoaKy}</Text>
        {status === 'collected' && (
          <View style={{ backgroundColor: '#E53935', borderRadius: 50, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
          </View>
        )}
      </View>

      {/* Data Grid */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: statusTextColor, opacity: 0.8 }}>Chỉ số cũ:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: statusTextColor }}>{soHD}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: statusTextColor, opacity: 0.8 }}>Chỉ số mới:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: statusTextColor }}>{soHDMoi}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: statusTextColor, opacity: 0.8 }}>M3:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: statusTextColor }}>{m3}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: statusTextColor, opacity: 0.8 }}>Tổng tiền:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: statusTextColor }}>{tienThu.toLocaleString('vi-VN')}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: statusTextColor, opacity: 0.8 }}>Tiền thu:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: statusTextColor }}>{tienThu.toLocaleString('vi-VN')}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: statusTextColor, opacity: 0.8 }}>Tiền nợ:</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: statusTextColor }}>{tienNo.toLocaleString('vi-VN')}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: statusTextColor, opacity: 0.8 }}>Ngày thu:</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: statusTextColor }}>{ngayThu}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: statusTextColor, opacity: 0.8 }}>NV thu:</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: statusTextColor }}>{nvThu}</Text>
          </View>
        </View>
      </View>

      {/* Action Items */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 4,
            backgroundColor: status === 'collected' ? '#81C784' : '#FDD835',
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '600', color: statusTextColor }}>
            {daXemHoaDon ? '✓ Đã thu' : 'Chưa thu'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 4,
            backgroundColor: status === 'collected' ? '#66BB6A' : '#FFEB3B',
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '600', color: statusTextColor, textAlign: 'center' }}>
            📷 {daXemHinh ? 'Xem hình ảnh' : 'Chưa có ảnh'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderRadius: 4,
            backgroundColor: status === 'collected' ? '#4CAF50' : '#FFF176',
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '600', color: statusTextColor, textAlign: 'center' }}>
            📋 {daXemON ? 'Xem hình ảnh' : 'Xem hoá đơn'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
