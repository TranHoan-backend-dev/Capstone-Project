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
      routeId: data.id, // truyền mã tuyến
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.routeIdContainer}>
            <Text style={styles.routeId}>{data.id}</Text>
          </View>

          <TouchableOpacity
            style={styles.actionBadge}
            onPress={goToCustomerList}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={18}
              color="#4CAF50"
            />
            <Text style={styles.actionText}>Danh sách ghi</Text>
          </TouchableOpacity>
        </View>

        <Text>{data.type}</Text>        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Số KH:</Text>
            <Text style={styles.statValue}>{data.totalCustomer}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Đã ghi:</Text>
            <Text style={styles.statValue}>{data.recorded}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Chưa ghi:</Text>
            <Text style={styles.statValue}>{data.unrecorded}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Cắt nước:</Text>
            <Text style={styles.statValue}>{data.cutWater || 0}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>M3:</Text>
            <Text style={styles.statValue}>{data.m3 || 0}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Tổng tiền:</Text>
            <Text style={[styles.statValue, styles.priceValue]}>{data.totalAmount || 0}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
