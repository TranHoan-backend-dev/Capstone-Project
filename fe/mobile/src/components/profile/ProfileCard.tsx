import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton, Divider, Chip } from 'react-native-paper';
import styles from './styles';
import ProfileInfoRow from './ProfileInfoRow';

type Props = {
  data: {
    name: string;
    address: string;
    customerId: string;
    status: string;
  };
};

export default function ProfileCard({ data }: Props) {
  return (
    <Surface style={styles.card} elevation={1}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Thông Tin Nhân Viên</Text>
      </View>

      <Divider />

      <View style={styles.profileContent}>
        <ProfileInfoRow
          leftLabel="TÊN KHÁCH HÀNG"
          leftValue={data.name}
          rightLabel="ĐỊA CHỈ"
          rightValue={data.address}
        />

        <ProfileInfoRow
          leftLabel="MÃ KHÁCH HÀNG"
          leftValue={data.customerId}
          strongLeft
          rightLabel="TRẠNG THÁI"
          rightComponent={
            <Chip
              icon={({ size, color }) => (
                <IconButton
                  icon="circle"
                  size={size}
                  iconColor="#10B981"
                  style={{ margin: 0 }}
                />
              )}
              style={styles.statusChip}
              textStyle={styles.statusText}
            >
              {data.status}
            </Chip>
          }
        />
      </View>
    </Surface>
  );
}
