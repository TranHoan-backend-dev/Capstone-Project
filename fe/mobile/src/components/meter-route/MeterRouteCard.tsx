import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './meterRoute.styles';

export default function MeterRouteCard({ data }: any) {
  const navigation = useNavigation<any>();

  const goToCustomerList = () => {
    navigation.navigate('CustomerList', {
      routeId: data.id,
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={goToCustomerList}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={[styles.routeIdContainer, { flexDirection: 'row', alignItems: 'center' }]}>
              <MaterialCommunityIcons name="map-marker-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
              <Text style={[styles.routeId, { color: '#1E88E5', fontWeight: 'bold' }]}>{data.type}</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="format-list-bulleted" size={18} color="#4CAF50" />
              <Text style={styles.actionText}>Danh sách ghi</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <MaterialCommunityIcons name="book-outline" size={22} color="#757575" style={{ marginRight: 8 }} />
            <Text style={{ color: '#333', fontWeight: '700', fontSize: 16, flex: 1 }}>{data.name}</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Số KH:</Text>
              <Text style={{ ...styles.statValue, color: '#1E88E5' }}>{data.totalCustomer}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Đã ghi:</Text>
              <Text style={{ ...styles.statValue, color: '#1E88E5' }}>{data.recorded}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Chưa ghi:</Text>
              <Text style={{ ...styles.statValue, color: '#1E88E5' }}>{data.unrecorded}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Cắt nước:</Text>
              <Text style={{ ...styles.statValue, color: '#1E88E5' }}>{data.cutWater || 0}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>M3:</Text>
              <Text style={{ ...styles.statValue, color: '#1E88E5' }}>{data.m3 || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Tổng tiền:</Text>
              <Text style={[styles.statValue, { color: '#EF4444' }]}>{data.totalAmount || 0}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
