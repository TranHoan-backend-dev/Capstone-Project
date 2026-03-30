import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { style } from './invoiceStyles';
import { useNavigation } from '@react-navigation/core';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function InvoiceCard({ invoice }: any) {
    const navigation = useNavigation<any>();
    
    const handlePress = () => {
      navigation.navigate('InvoiceDetail', { 
        customerId: invoice.id,
        customerName: invoice.name,
        address: invoice.address,
        phone: invoice.phone
      });
    };

  return (
    <Card style={[style.card, { backgroundColor: '#fff', elevation: 1, borderBottomWidth: 1, borderBottomColor: '#eee' }]}>
      <TouchableOpacity onPress={handlePress} style={{ padding: 12 }}>
        <View style={style.cardHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="cash-multiple" size={20} color="#4CAF50" style={{ marginRight: 4 }} />
            <Text style={{ color: '#1E88E5', fontWeight: '500' }}>Thu tiền</Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="account-circle-outline" size={20} color="#666" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 14, color: '#333', fontWeight: '500' }}>{invoice.name}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Icon name="map-marker-outline" size={20} color="#666" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 13, color: '#333', flex: 1 }}>{invoice.address}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="phone-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 14, color: '#333' }}>Điện thoại</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#333', fontWeight: '500' }}>{invoice.phone}</Text>
          </View>
        </View>

        <View style={[style.summaryRow, { marginTop: 12, marginBottom: 8 }]}>
          <Text style={{ fontSize: 13, color: '#333' }}>
            Tổng số hoá đơn: <Text style={{ color: '#1E88E5', fontWeight: 'bold' }}>{invoice.totalInvoices}</Text>
          </Text>
          <Text style={{ fontSize: 13, color: '#333' }}>
            Tổng số tiền: <Text style={{ color: '#D32F2F', fontWeight: 'bold' }}>{invoice.totalMoney}</Text>
          </Text>
        </View>

        <View style={{ backgroundColor: '#FF9800', padding: 8, borderRadius: 10, marginTop: 4 }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '500' }}>
            Hình thức thanh toán: <Text style={{ fontWeight: 'normal' }}>{invoice.paymentMethod}</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </Card>
  );
}
