import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, Text, Divider, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThreeMonthsModal from './ThreeMonthsModal';
import StatusDropdown from './StatusDropdown';
import styles from './meterInput.styles';

interface MeterInputStatusCardProps {
  value?: string;
  onStatusChange?: (value: string) => void;
}

const STATUS_OPTIONS = [
  { label: 'Bình thường', value: 'binh-thuong' },
  { label: 'Vòng', value: 'vong' },
  { label: 'Thay đổi độ lệch chỉ số', value: 'thay-doi-do-lech' },
  { label: 'Cất nước', value: 'cat-nuoc' },
  { label: 'Bình thường', value: 'binh-thuong-2' },
];

export default function MeterInputStatusCard({
  value = 'binh-thuong',
  onStatusChange,
}: MeterInputStatusCardProps) {
  const [selectedStatus, setSelectedStatus] = useState(value);
  const [showThreeMonthsModal, setShowThreeMonthsModal] = useState(false);

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    onStatusChange?.(val);
  };

  return (
    <>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.threeMonthsButtonRow}>
            <Text style={styles.infoLabel}>Trạng thái đồng hồ</Text>
            <Button
              mode="outlined"
              onPress={() => setShowThreeMonthsModal(true)}
              style={styles.threeMonthsButton}
              labelStyle={styles.threeMonthsButtonLabel}
            >
              <Icon name="information" size={16} color="#1E88E5" /> 3 tháng liền kề
            </Button>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.dropdownContainer}>
            <StatusDropdown
              value={selectedStatus}
              options={STATUS_OPTIONS}
              onChange={handleStatusChange}
            />
          </View>
        </Card.Content>
      </Card>

      <ThreeMonthsModal
        visible={showThreeMonthsModal}
        onClose={() => setShowThreeMonthsModal(false)}
      />
    </>
  );
}
