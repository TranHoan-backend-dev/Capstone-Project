import React from 'react';
import { View } from 'react-native';
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
    });
  };
  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header Row: ID and Status Badge */}
        <View style={styles.headerRow}>
          <View style={styles.idSection}>
            <Icon name="checkbox-marked" size={16} color="#666" />
            <Text style={styles.customerId}>{data.id}</Text>
            <Text style={styles.stt}>STT: {data.stt}</Text>
          </View>

          <Button
            mode="contained"
            icon="pencil-outline"
            compact
            style={styles.inputButton}
            labelStyle={styles.inputButtonLabel}
            onPress={handleInputMeter}
          >
            Nhập chỉ số
          </Button>
        </View>

        {/* Customer Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Icon name="account" size={16} color="#666" />
            <Text style={styles.customerName}>{data.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={16} color="#666" />
            <Text style={styles.customerAddress}>{data.address}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color="#666" />
            <Text style={styles.date}>{data.date}</Text>
          </View>
        </View>

        {/* Stats Row 1: Chỉ số & M3 */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Chỉ số mới:</Text>
            <Text style={styles.statValue}>{data.newIndex}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>M3:</Text>
            <Text style={styles.statValue}>{data.m3}</Text>
          </View>
        </View>

        {/* Stats Row 2: Status & Amount */}
        <View style={styles.statsRow}>
          <View style={styles.statusItem}>
            <Icon name="check-circle" size={14} color="#4CAF50" />
            <Text style={styles.statusText}>{data.status}</Text>
          </View>
          <View style={styles.amountItem}>
            <Text style={styles.amountLabel}>Số tiền:</Text>
            <Text style={styles.amountValue}>{data.amount}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}
