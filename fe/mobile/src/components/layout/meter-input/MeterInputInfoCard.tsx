import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MeterInputInfoCardProps {
  customerName?: string;
  stt?: number;
  address: string;
  phone: string;
  meterId: string;
  meterType?: string;
  waterType: string;
  householdNumber?: string;
  populationNumber?: string;
  oldIndex?: string;
  oldDate?: string;
  oldMass?: string;
}

export default function MeterInputInfoCard({
  customerName,
  stt = 1,
  address,
  phone,
  meterId,
  meterType = '',
  waterType,
  householdNumber = '0',
  populationNumber = '0',
  oldDate = 'N/A',
}: MeterInputInfoCardProps) {
  return (
    <Card style={styles.card}>
      {customerName && (
        <View style={styles.header}>
          <Icon name="account-circle-outline" size={24} color="#fff" />
          <Text style={styles.headerText}>{customerName}</Text>
        </View>
      )}

      <Card.Content style={{ padding: 0 }}>
        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Icon name="calendar-clock" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
            <Text style={styles.label}>Ngày ghi cũ</Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={styles.value}>{oldDate}</Text>
          </View>
        </View>
        <Divider />

        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Icon name="numeric" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
            <Text style={styles.label}>STT</Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={[styles.value, { color: '#1E88E5', fontWeight: 'bold' }]}>{stt}</Text>
          </View>
        </View>
        <Divider />

        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Icon name="map-marker-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
            <Text style={styles.label}>Địa chỉ</Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={styles.value} numberOfLines={2}>{address}</Text>
          </View>
        </View>
        <Divider />

        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Icon name="phone-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
            <Text style={styles.label}>Điện thoại</Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={styles.value}>{phone}</Text>
          </View>
        </View>
        <Divider />

        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Icon name="database-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
            <Text style={styles.label}>Mã ĐH</Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={styles.value}>{meterId}</Text>
          </View>
        </View>
        <Divider />

        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Icon name="format-list-bulleted" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
            <Text style={styles.label}>Chủng loại ĐH</Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={styles.value}>{meterType}</Text>
          </View>
        </View>
        <Divider />

        <View style={styles.row}>
          <View style={styles.labelCol}>
            <Icon name="receipt" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
            <Text style={styles.label}>Bảng giá</Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={styles.value}>{waterType}</Text>
          </View>
        </View>
        <Divider />

        <View style={styles.rowSplit}>
          <View style={styles.splitBlock}>
            <Icon name="card-account-details-outline" size={20} color="#1E88E5" style={{ marginRight: 8 }} />
            <Text style={styles.label}>Số hộ</Text>
            <Text style={[styles.value, { color: '#1E88E5', fontWeight: 'bold', marginLeft: 'auto', marginRight: 12 }]}>{householdNumber}</Text>
          </View>
          <View style={styles.splitDivider} />
          <View style={[styles.splitBlock, { paddingLeft: 12 }]}>
            <Text style={styles.label}>Số nhân khẩu</Text>
            <Text style={[styles.value, { color: '#1E88E5', fontWeight: 'bold', marginLeft: 'auto' }]}>{populationNumber}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-start',
  },
  rowSplit: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  labelCol: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueCol: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
  splitBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    height: '100%',
  },
});
