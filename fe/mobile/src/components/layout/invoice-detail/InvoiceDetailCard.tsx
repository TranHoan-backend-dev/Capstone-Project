import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  onShowReceipt?: () => void;
  onShowImage?: () => void;
}

export default function InvoiceDetailCard({
  khoaKy,
  soHD,
  soHDMoi,
  m3,
  tienThu,
  tienNo,
  ngayThu,
  nvThu,
  onShowReceipt,
  onShowImage,
}: InvoiceDetailCardProps) {
  return (
    <View style={{ backgroundColor: '#FFEB3B', borderRadius: 8, padding: 12, marginBottom: 12 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)', paddingBottom: 12 }}>
        <Icon name="checkbox-blank-outline" size={24} color="#666" style={{ position: 'absolute', left: 0 }} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Kỳ: {khoaKy}</Text>
      </View>

      {/* Grid Data */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ fontSize: 13, color: '#333' }}>Chỉ số cũ: </Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E88E5' }}>{soHD}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 13, color: '#333' }}>Chỉ số mới: </Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E88E5' }}>{soHDMoi}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ fontSize: 13, color: '#333' }}>M3: </Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E88E5' }}>{m3}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 13, color: '#333' }}>Tổng tiền: </Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#D32F2F' }}>{tienThu.toLocaleString('vi-VN')}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={{ fontSize: 13, color: '#333' }}>Tiền thu: </Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E88E5' }}>{tienThu.toLocaleString('vi-VN')}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 13, color: '#333' }}>Tiền nợ: </Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E88E5' }}>{tienNo}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1.5, flexDirection: 'row' }}>
            <Text style={{ fontSize: 13, color: '#333' }}>Ngày thu: </Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E88E5' }}>{ngayThu}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 13, color: '#333' }}>NV thu: </Text>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1E88E5' }}>{nvThu}</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="check" size={20} color="#333" />
          <Text style={{ fontSize: 14, color: '#333', marginLeft: 4 }}>Đã thu</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onShowReceipt}
          >
            <Icon name="file-document-outline" size={20} color="#D32F2F" />
            <Text style={{ fontSize: 14, color: '#D32F2F', fontWeight: '500', marginLeft: 4 }}>Xem hoá đơn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={onShowImage}
          >
            <Icon name="camera-outline" size={20} color="#1E88E5" />
            <Text style={{ fontSize: 14, color: '#1E88E5', fontWeight: '500', marginLeft: 4 }}>Xem hình ảnh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
