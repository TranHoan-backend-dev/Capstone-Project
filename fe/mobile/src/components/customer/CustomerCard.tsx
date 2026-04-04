import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import styles from './customer.styles';

export default function CustomerCard({ data }: any) {
  const navigation = useNavigation<any>();

  const handleCardPress = () => {
    navigation.navigate('MeterInput', {
      customerId: data.id,
      customerName: data.name,
      address: data.address,
      stt: data.stt,
    });
  };

  const handleTakePhoto = () => {
    navigation.navigate('CaptureWaterMeter', {
      customerId: data.id,
      customerName: data.name,
      address: data.address,
      serial: data.waterMeterId,
      stt: data.stt,
      source: 'customer',
    });
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleCardPress}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          {/* Header Row: ID and Status Badge */}
          <View style={styles.headerRow}>
            <View style={styles.sttSection}>
              <Icon name="format-list-numbered" size={20} color="#1E88E5" style={styles.sttIcon} />
              <Text style={styles.sttText}>STT: {data.stt}</Text>
            </View>

            <Button
              mode="contained"
              icon="camera"
              compact
              style={styles.photoButton}
              labelStyle={styles.photoButtonLabel}
              onPress={handleTakePhoto}
            >
              Chụp ảnh
            </Button>
          </View>

          {/* Customer Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Icon name="account-circle-outline" size={20} color="#757575" style={styles.infoIcon} />
              <Text style={styles.customerName}>{data.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="map-marker-outline" size={20} color="#757575" style={styles.infoIcon} />
              <Text style={styles.customerAddress} numberOfLines={2}>{data.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <Icon name="calendar-clock-outline" size={20} color="#757575" style={styles.infoIcon} />
              <Text style={styles.dateText}>{data.date || '24/12/2025 11:44'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Stats Row 1: Chỉ số & M3 */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Chỉ số mới:</Text>
              <Text style={styles.statValue}>{data.newIndex}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>M3:</Text>
              <Text style={styles.m3Value}>{data.m3}</Text>
            </View>
          </View>

          {/* Stats Row 2: Status & Amount */}
          <View style={styles.statusRow}>
            <View style={styles.statusContainer}>
              <Icon 
                name={data.status === 'Đã ghi' ? 'check-circle' : (data.status === 'Đã chụp ảnh' ? 'camera-check' : 'alert-circle-outline')} 
                size={20} 
                color={data.status === 'Đã ghi' ? '#4CAF50' : (data.status === 'Đã chụp ảnh' ? '#F59E0B' : '#EF4444')} 
                style={styles.statusIcon} 
              />
              <Text style={[
                styles.statusText,
                data.status === 'Đã ghi' 
                  ? styles.statusDone 
                  : (data.status === 'Đã chụp ảnh' ? styles.statusPending : styles.statusAlert)
              ]}>
                {data.status}
              </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Số tiền:</Text>
              <Text style={styles.amountValue}>{data.amount}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}
