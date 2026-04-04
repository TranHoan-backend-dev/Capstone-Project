import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './debtRoute.styles';
import { useNavigation } from '@react-navigation/native';

interface CollectionItem {
  id: string;
  meterId: string;
  soHD: string;
  daZhu: string;
  conLai: string;
  tongTien: number;
  tienThu: number;
  tienConLai: number;
  soHDTon?: string;
  daZhuThuTon?: string;
  tienThuThuTon?: number;
  tongTienTon?: number;
  tienTonConLai?: number;
}

interface CollectionListItemProps {
  item: CollectionItem;
}

const formatNumber = (num: number | string) => {
  if (num === undefined || num === null) return '0';
  if (typeof num === 'string') return num;
  return num.toLocaleString('vi-VN');
};

export default function CollectionListItem({ item }: CollectionListItemProps) {
  const navigation = useNavigation<any>();
  const goToCustomerList = () => {
    navigation.navigate('InvoiceList', { roadmapId: item.id });
  };

  return (
    <TouchableOpacity 
      style={styles.collectionCard} 
      onPress={goToCustomerList}
      activeOpacity={0.7}
    >
      {/* Header Rows */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="book-outline" size={20} color="#8D6E63" style={{ marginRight: 8 }} />
            <Text style={{ color: '#1E88E5', fontWeight: '500', fontSize: 16 }}>{item.meterId}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="format-list-checks" size={18} color="#4CAF50" style={{ marginRight: 4 }} />
            <Text style={{ color: '#1E88E5', fontSize: 13 }}>Danh sách hoá đơn</Text>
          </View>
        </View>
      </View>

      {/* Data Table */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Số HĐ:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>{item.soHD}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Tổng tiền:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14 }}>{formatNumber(item.tongTien)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Đã thu:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>{item.daZhu}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Tiền thu:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14 }}>{formatNumber(item.tienThu)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Còn lại:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>{item.conLai}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Tiền còn lại:</Text>
            <Text style={{ color: '#D32F2F', fontWeight: 'bold', fontSize: 14 }}>{formatNumber(item.tienConLai)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Số HĐ tồn:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>{item.soHDTon}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Tổng tiền tồn:</Text>
            <Text style={{ color: '#D32F2F', fontWeight: 'bold', fontSize: 14 }}>{formatNumber(item.tongTienTon || 0)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Đã thu tồn:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>{item.daZhuThuTon}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Tiền thu tồn:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14 }}>{formatNumber(item.tienThuThuTon || 0)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Tồn còn lại:</Text>
            <Text style={{ color: '#1E88E5', fontWeight: 'bold', fontSize: 14, marginRight: 20 }}>{item.soHDTon}</Text>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#333', fontSize: 14 }}>Tiền tồn còn lại:</Text>
            <Text style={{ color: '#D32F2F', fontWeight: 'bold', fontSize: 14 }}>{formatNumber(item.tienTonConLai || 0)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
