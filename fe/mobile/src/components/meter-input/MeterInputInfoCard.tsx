import React from 'react';
import { View } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './meterInput.styles';

interface MeterInputInfoCardProps {
  customerName?: string;
  customerId: string;
  stt?: number;
  address: string;
  phone: string;
  meterId: string;
  meterType?: string;
  waterType: string;
  householdNumber?: string;
  populationNumber?: string;
  oldIndex: string;
}

export default function MeterInputInfoCard({
  customerName,
  customerId,
  stt = 1,
  address,
  phone,
  meterId,
  meterType = '93Vc',
  waterType,
  householdNumber = '0',
  populationNumber = '0',
  oldIndex,
}: MeterInputInfoCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        {customerName && (
          <>
            <View style={styles.infoRow}>
              <Icon name="account" size={18} color="#1E88E5" />
              <Text style={styles.customerNameHeader}>{customerName}</Text>
              <View style={styles.headerWithBadge}>
                <View style={styles.sttBadgeTop}>
                  <Text style={styles.sttText}>STT</Text>
                  <Text style={styles.sttValue}>{stt}</Text>
                </View>
              </View>
            </View>
            <Divider style={styles.divider} />
          </>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mã kh</Text>
          <Text style={styles.infoValue}>{customerId}</Text>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Địa chỉ</Text>
          <Text style={styles.infoValue}>{address}</Text>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Điện thoại</Text>
          <Text style={styles.infoValue}>{phone}</Text>
          <Icon name="phone" size={16} color="#1E88E5" />
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Mã DH</Text>
          <Text style={styles.infoValue}>{meterId}</Text>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Chủng loại DH</Text>
          <Text style={styles.infoValue}>{meterType}</Text>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Bằng giá</Text>
          <Text style={styles.infoValue}>{waterType}</Text>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số hộ</Text>
          <Text style={styles.infoValue}>{householdNumber}</Text>
        </View>
        <Divider style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số nhân khẩu</Text>
          <Text style={styles.infoValue}>{populationNumber}</Text>
        </View>
        <Divider style={styles.divider} />
      </Card.Content>
    </Card>
  );
}
