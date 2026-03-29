import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './customer.styles';

export default function CustomerCard({ data }: any) {
  const navigation = useNavigation<any>();

  const handleInputMeter = () => {
    navigation.navigate('MeterInput', {
      customerId: data.id,
      customerName: data.name,
      address: data.address,
      stt: data.stt,
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleInputMeter}>
      <Card style={styles.card}>
        <Card.Content style={{ paddingVertical: 12 }}>
          {/* Header Row: ID and Status Badge */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Icon name="format-list-numbered" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
              <Text style={{ color: '#1E88E5', fontWeight: '700', fontSize: 16 }}>STT: {data.stt}</Text>
            </View>

            <Button
              mode="outlined"
              icon="file-document-edit-outline"
              compact
              style={{ borderColor: '#4CAF50', borderRadius: 6 }}
              labelStyle={{ color: '#4CAF50', fontSize: 13, marginHorizontal: 8, marginVertical: 4 }}
              onPress={handleInputMeter}
            >
              Nhập chỉ số
            </Button>
          </View>

          {/* Customer Info */}
          <View style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon name="account-circle-outline" size={20} color="#757575" style={{ marginRight: 8 }} />
              <Text style={{ fontWeight: '600', color: '#333', fontSize: 15 }}>{data.name}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon name="map-marker-outline" size={20} color="#757575" style={{ marginRight: 8 }} />
              <Text style={{ color: '#555', flex: 1, fontSize: 13 }} numberOfLines={2}>{data.address}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="calendar-clock-outline" size={20} color="#757575" style={{ marginRight: 8 }} />
              <Text style={{ color: '#555', fontSize: 13 }}>{data.date || '24/12/2025 11:44'}</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#EEEEEE', marginBottom: 12 }} />

          {/* Stats Row 1: Chỉ số & M3 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#555', fontSize: 14 }}>Chỉ số mới:</Text>
              <Text style={{ color: '#333', fontSize: 14, marginLeft: 4 }}>{data.newIndex}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#555', fontSize: 14 }}>M3:</Text>
              <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 14, marginLeft: 6 }}>{data.m3}</Text>
            </View>
          </View>

          {/* Stats Row 2: Status & Amount */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="check-bold" size={20} color="#4CAF50" style={{ marginRight: 6 }} />
              <Text style={{ color: '#4CAF50', fontWeight: '700', fontSize: 16 }}>{data.status}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#555', fontSize: 14 }}>Số tiền:</Text>
              <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 14, marginLeft: 6 }}>{data.amount}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
